package com.nagarseva.backend.service;

import com.cloudinary.Cloudinary;
import com.nagarseva.backend.dto.*;
import com.nagarseva.backend.entity.*;
import com.nagarseva.backend.enums.*;
import com.nagarseva.backend.exception.*;
import com.nagarseva.backend.repository.*;
import com.nagarseva.backend.security.CustomUserDetails;
import com.nagarseva.backend.validation.ImageValidator;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.List;
import java.util.stream.Stream;

@Service
@AllArgsConstructor
public class ComplaintService {

    private ComplaintRepository complaintRepository;
    private WardRepository wardRepository;
    private Cloudinary cloudinary;
    private ImageValidator imageValidator;
    private UserRepository userRepository;
    private FlowTransitionValidationService flowValidation;
    private ImageMetaRepository imageMetaRepository;
    private EmailService emailService;
    private ComplaintStatusHistoryRepository complaintStatusHistoryRepository;

    private Complaint getComplaintOrThrow(int complaintId) {
        return complaintRepository.findById(complaintId).orElseThrow(() -> new ComplaintNotExistException("No Complaint Exists by this Id"));
    }

    private void validateOwnership(Complaint complaint, int userId) {
        if (!complaint.getCreatedBy().getId().equals(userId))
            throw new UserMismatchException("Access denied: You cannot edit another user's complaints");
    }

    private void validateComplaintEditable(Complaint complaint) {
        if (!complaint.getStatus().equals(Status.CREATED))
            throw new ComplaintModificationForbiddenException("Complaint has already been verified by admin and cannot be edited further.");
    }

    private void validateCitizen(User user) {
        if (!user.getRole().equals(Role.CITIZEN)) {
            throw new InvalidUserRoleException("Invalid User! Only Citizen are allowed");
        }
    }

    private void validateOfficer(User user) {
        if (!user.getRole().equals(Role.OFFICER)) {
            throw new InvalidUserRoleException("Invalid User! Only Officer are allowed");
        }
    }

    private void validateAdmin(User user) {
        if (!user.getRole().equals(Role.ADMIN)) {
            throw new InvalidUserRoleException("Invalid User! Only Officer are allowed");
        }
    }

    private void validateCouncillor(User user) {
        if (!user.getRole().equals(Role.COUNCILLOR)) {
            throw new InvalidUserRoleException("Invalid User! Only Ward Councillor are allowed");
        }
    }

    private User fetchAuthenticatedUser() {
        CustomUserDetails user = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return user.getUser();

    }

    private void updateStatusHistory(Status status, Complaint complaint, LocalDateTime currentTime, String remark, String contactDetails, User officer) {

        if (complaint.getStatus() != null) {
            flowValidation.validateTransition(complaint.getStatus(), status);
        }

        List<ComplaintStatusHistory> complaintStatusHistories = complaint.getComplaintStatusHistory();
        if (complaintStatusHistories == null) complaintStatusHistories = new ArrayList<>();

        ComplaintStatusHistory complaintStatus = new ComplaintStatusHistory();
        complaintStatus.setComplaint(complaint);
        complaintStatus.setStatus(status);
        complaintStatus.setCycleNumber(complaint.getCycleNumber());

        complaintStatus.setChangedAt(currentTime);

        if (remark != null && !remark.isBlank() && (status == Status.PENDING_VERIFICATION || status == Status.REOPENED)) {
            complaintStatus.setRemark(remark);
        }

        if (contactDetails != null && !contactDetails.isBlank() && status.equals(Status.REOPENED))
            complaintStatus.setContactDetails(contactDetails);

        if (officer != null && (status == Status.ASSIGNED || status == Status.IN_PROGRESS || status == Status.PENDING_VERIFICATION || status == Status.CLOSED || status == Status.AUTO_CLOSED))
            complaintStatus.setSolvedByOfficer(officer);

        complaintStatusHistories.add(complaintStatus);

        complaint.setStatus(status);
        complaint.setComplaintStatusHistory(complaintStatusHistories);
        complaint.setLastUpdatedAt(currentTime);

    }

    @Transactional
    public RegisterComplaintResponse addNewComplaint(RegisterComplaintRequest registerComplaintRequest) {
        User citizen = fetchAuthenticatedUser();
        Ward citizensWard = citizen.getCitizensWard();
        List<MultipartFile> files = registerComplaintRequest.getImages();

        validateCitizen(citizen);

        boolean hasCoordinates =
                registerComplaintRequest.getLatitude() != null
                        && registerComplaintRequest.getLongitude() != null;

        boolean hasLandmark =
                registerComplaintRequest.getLandmark() != null
                        && !registerComplaintRequest.getLandmark().trim().isBlank();

        if (!hasCoordinates && !hasLandmark) {
            throw new InsufficentLocationDetailsException("Please provide either your current location or a nearby landmark to proceed.");
        }

        Ward issuedComplaintWard = null;

        if (registerComplaintRequest.getWardId() != null) {
            issuedComplaintWard = wardRepository.findById(registerComplaintRequest.getWardId()).orElseThrow(() -> new InvalidWardException("Invalid WardId!"));
        }

        // Validation for complaint Images
        if (files != null && !files.isEmpty()) {

            if (files.size() > 3) throw new MaxImageUploadExceededException("Maximum 3 Images are allowed");

            imageValidator.validate(files);
        }

        Complaint raiseComplaint = new Complaint();
        raiseComplaint.setTitle(registerComplaintRequest.getTitle());
        raiseComplaint.setIssueType(registerComplaintRequest.getIssueType());
        raiseComplaint.setPriority(registerComplaintRequest.getIssueType().getPriority());
        raiseComplaint.setDescription(registerComplaintRequest.getDesc());

        if (issuedComplaintWard != null) raiseComplaint.setWard(issuedComplaintWard);
        else raiseComplaint.setWard(citizensWard);

        LocalDateTime currentTime = LocalDateTime.now();

        updateStatusHistory(Status.CREATED, raiseComplaint, currentTime, null, null, null);

        raiseComplaint.setCreatedBy(citizen);
        raiseComplaint.setCreatedAt(currentTime);

        if (hasCoordinates) {
            raiseComplaint.setLatitude(registerComplaintRequest.getLatitude());
            raiseComplaint.setLongitude(registerComplaintRequest.getLongitude());
        }

        raiseComplaint.setLandmark(
                hasLandmark
                        ? registerComplaintRequest.getLandmark().trim()
                        : null
        );

        List<ImageMeta> images = new ArrayList<>();
        Complaint savedComplaint = null;

        try {
            if (files != null && !files.isEmpty()) {
                for (MultipartFile file : files) {
                    ImageMeta imageMeta = uploadFile(file);
                    imageMeta.setComplaint(raiseComplaint);
                    imageMeta.setImageType(ImageType.BEFORE);
                    imageMeta.setCycleNumber(0);
                    images.add(imageMeta);
                }
            }
            raiseComplaint.setImages(images);
            savedComplaint = complaintRepository.save(raiseComplaint);
        } catch (Exception e) {
            for (ImageMeta img : images) {
                try {
                    deleteFile(img);
                } catch (IOException e1) {
                    System.out.println("Cloudinary cleanup failed for complaint");
                    e1.printStackTrace();
                }
            }
            throw new ComplaintCreationFailedException("Complaint creation failed: Complaint could not be persisted due to an unexpected error.");
        }
        RegisterComplaintResponse response = new RegisterComplaintResponse();
        response.setComplaintId(savedComplaint.getId());
        response.setSuccess(true);
        response.setMessage("Complaint raised successfully.");

        return response;

    }

    public ImageMeta uploadFile(MultipartFile file) throws IOException {
        Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), Map.of("folder", "complaints"));

        String uploadedImageUrl = uploadResult.get("secure_url").toString();
        String uploadedImagePublicId = uploadResult.get("public_id").toString();

        ImageMeta imageMeta = new ImageMeta();
        imageMeta.setImageUrl(uploadedImageUrl);
        imageMeta.setImagePublicId(uploadedImagePublicId);
        return imageMeta;
    }

    public UpdateComplaintResponse updateComplaintCitizen(int complaintId, UpdateComplaintRequest updateComplaintRequest, List<MultipartFile> files) throws IOException {
        CustomUserDetails contextUser = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        User user = contextUser.getUser();

        validateCitizen(user);
        Complaint complaint = getComplaintOrThrow(complaintId);

        validateOwnership(complaint, user.getId());
        validateComplaintEditable(complaint);

        if (updateComplaintRequest.getWardId() != null) {
            Ward updatedWard = wardRepository.findById(updateComplaintRequest.getWardId()).orElseThrow(() -> new InvalidWardException("Invalid WardId! No ward exists with this Id."));

            complaint.setWard(updatedWard);
        }

        if (updateComplaintRequest.getTitle() != null) {
            complaint.setTitle(updateComplaintRequest.getTitle());
        }

        if (updateComplaintRequest.getDesc() != null) {
            complaint.setDescription(updateComplaintRequest.getDesc());
        }

        if (updateComplaintRequest.getIssueType() != null) {
            complaint.setIssueType(updateComplaintRequest.getIssueType());
        }

        List<String> updatedImages = updateComplaintRequest.getImagePublicIds();
        Set<String> updatedSet = updatedImages == null ? Collections.emptySet() : new HashSet<>(updatedImages);

        List<ImageMeta> currentImages = complaint.getImages();

        if (currentImages != null) {
            Iterator<ImageMeta> it = currentImages.iterator();

            while (it.hasNext()) {
                ImageMeta img = it.next();
                if (!updatedSet.contains(img.getImagePublicId())) {
                    Map<String, Object> res = cloudinary.uploader().destroy(img.getImagePublicId(), Collections.emptyMap());

                    if (!res.get("result").equals("ok") && !res.get("result").equals("not found"))
                        throw new ImageDeletionFailedException("Can't Delete the Image.");
                    it.remove();
                }
            }
        }

        if (currentImages == null) {
            currentImages = new ArrayList<>();
            complaint.setImages(currentImages);
        }

        if (files != null) {
            if (currentImages.size() + files.size() > 3)
                throw new MaxImageUploadExceededException("Maximum 3 Images are allowed");

            imageValidator.validate(files);
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    ImageMeta imageMeta = uploadFile(file);
                    imageMeta.setComplaint(complaint);
                    imageMeta.setImageType(ImageType.BEFORE);
                    currentImages.add(imageMeta);
                }
            }
        }


        complaint.setLastUpdatedAt(LocalDateTime.now());
        complaintRepository.save(complaint);

        UpdateComplaintResponse response = new UpdateComplaintResponse();
        response.setSuccess(true);
        response.setMessage("Updated Successfully");

        return response;
    }

    public ComplaintDetailsResponse showComplaintsById(int complaintId) {
        Complaint complaint = getComplaintOrThrow(complaintId);

        ComplaintDetailsResponse response = new ComplaintDetailsResponse();
        response.setSuccess(true);
        response.setMessage("Data fetched successfully.");

        response.setComplaintId(complaint.getId());
        response.setTitle(complaint.getTitle());
        response.setDescription(complaint.getDescription());
        response.setIssueType(complaint.getIssueType());
        response.setIssueStatus(complaint.getStatus());

        // Though we ensure that every complaint has valid ward but still it's better to avoid NPE
        Ward complaintWard = complaint.getWard();

        if (complaintWard != null) {

            WardResponseData wardResponseData = new WardResponseData();
            wardResponseData.setWardId(complaintWard.getId());
            wardResponseData.setWardName(complaintWard.getWardName());
            if (complaintWard.getCouncillor() != null)
                wardResponseData.setWardCouncillor(complaintWard.getCouncillor().getFullName());
            else wardResponseData.setWardCouncillor(null);
            response.setWard(wardResponseData);

        } else {
            response.setWard(null);
        }

        // Useful, when issue is not assigned to any of the Officier by admin yet.
        if (complaint.getAssignedTo() != null) {
            AssignedOfficerData officerData = new AssignedOfficerData();
            officerData.setOfficerDepartment(complaint.getAssignedTo().getDepartment());
            officerData.setOfficerName(complaint.getAssignedTo().getFullName());
            officerData.setActive(complaint.getAssignedTo().isActive());
            response.setAssignedTo(officerData);
        } else {
            response.setAssignedTo(null);
        }

        CitizenInfo citizenInfo = new CitizenInfo();
        citizenInfo.setCitizenName(complaint.getCreatedBy().getFullName());
        citizenInfo.setCitizenWard(complaint.getCreatedBy().getCitizensWard().getId());
        citizenInfo.setCitizenEmail(complaint.getCreatedBy().getEmail());

        response.setCitizenInfo(citizenInfo);
        response.setCreatedAt(complaint.getCreatedAt());
        response.setPriority(complaint.getPriority());

        List<ImageMeta> complaintImages = complaint.getImages();
        List<ImageResponse> imageResponses = new ArrayList<>();

        if (complaintImages == null) complaintImages = new ArrayList<>();

        for (ImageMeta img : complaintImages) {
            ImageResponse imgResp = new ImageResponse();
            imgResp.setUrl(img.getImageUrl());
            imgResp.setPublicId(img.getImagePublicId());
            imgResp.setImageType(img.getImageType());
            imageResponses.add(imgResp);
        }

        response.setComplaintRaisedImages(imageResponses);

        LocationResponse locationResponse = new LocationResponse();
        locationResponse.setLatitude(complaint.getLatitude());
        locationResponse.setLongtitude(complaint.getLongitude());
        locationResponse.setLandmark(complaint.getLandmark());

        response.setLocationResponse(locationResponse);

        addCycleDetails(complaint, response, complaintImages);

        return response;

    }

    private void addCycleDetails(Complaint complaint, ComplaintDetailsResponse response, List<ImageMeta> complaintImages) {

        List<ComplaintCycleResponse> cycles = new ArrayList<>();
        int maxCycle = complaint.getCycleNumber();

        for (int cycle = 0; cycle <= maxCycle; cycle++) {
            final int currentCycle = cycle;

            ComplaintCycleResponse cycleResponse = new ComplaintCycleResponse();
            cycleResponse.setCycleNumber(cycle);
            cycleResponse.setCurrentCycle(cycle == complaint.getCycleNumber());

            // Officer Remarks Part
            ComplaintStatusHistory pendingVerificationHistory = complaint.getComplaintStatusHistory()
                    .stream()
                    .filter(
                            history -> history.getCycleNumber() == currentCycle
                                    && history.getStatus() == Status.PENDING_VERIFICATION
                    )
                    .max(Comparator.comparing(ComplaintStatusHistory::getChangedAt)).orElse(null);

            if (pendingVerificationHistory != null) {
                cycleResponse.setOfficerRemarks(pendingVerificationHistory.getRemark());
                cycleResponse.setSubmittedAt(pendingVerificationHistory.getChangedAt());
            }

            // Citizen Remarks Part
            ComplaintStatusHistory reopenedHistory = complaint.getComplaintStatusHistory()
                    .stream()
                    .filter(
                            history -> history.getCycleNumber() == currentCycle
                                    && history.getStatus() == Status.REOPENED
                    )
                    .max(Comparator.comparing(ComplaintStatusHistory::getChangedAt)).orElse(null);

            if (reopenedHistory != null) {
                cycleResponse.setCitizenRemarks(reopenedHistory.getRemark());
                cycleResponse.setCitizenContactDetails(reopenedHistory.getContactDetails());
            }

            // Image uplaoded by Officer
            Stream<ImageMeta> imageStream = complaintImages
                    .stream()
                    .filter(
                            img -> img.getImageType() == ImageType.AFTER
                                    && img.getCycleNumber() == currentCycle
                    );

            List<ImageResponse> completionImages = imageStream
                    .map(
                            img -> {
                                ImageResponse imageResponse = new ImageResponse();
                                imageResponse.setUrl(img.getImageUrl());
                                imageResponse.setPublicId(img.getImagePublicId());
                                imageResponse.setImageType(img.getImageType());

                                return imageResponse;
                            }
                    )
                    .toList();

            cycleResponse.setCompletionImages(completionImages);
            cycles.add(cycleResponse);
        }

        response.setCycles(cycles);
    }

    public void deleteFile(ImageMeta img) throws IOException {
        Map<String, Object> res = cloudinary.uploader().destroy(img.getImagePublicId(), Collections.emptyMap());

        if (!res.get("result").equals("ok") && !res.get("result").equals("not found"))
            throw new ImageDeletionFailedException("Can't Delete the Image.");
    }

    @Transactional
    public DeleteComplaintResponse deleteComplaintById(int complaintId) {
        Complaint complaint = getComplaintOrThrow(complaintId);
        User user = fetchAuthenticatedUser();

        validateComplaintEditable(complaint);
        validateCitizen(user);
        validateOwnership(complaint, user.getId());

        List<ImageMeta> complaintImages = complaint.getImages();
        complaintRepository.delete(complaint);

        try {
            if (complaintImages != null) {
                for (ImageMeta img : complaintImages) {
                    deleteFile(img);
                }
            }

        } catch (Exception e) {
            System.out.println("Cloudinary cleanup failed for complaintId: " + complaintId);
            e.printStackTrace();
        }

        DeleteComplaintResponse response = new DeleteComplaintResponse();
        response.setSuccess(true);
        response.setMessage("Complaint deleted successfully.");
        response.setComplaintId(complaintId);
        return response;
    }

    public ComplaintPageResponse showUserComplaints(int page, int size, Status status, IssueType issueType) {
        User user = fetchAuthenticatedUser();

        validateCitizen(user);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Complaint> complaintsPage = complaintRepository.findByUserIdWithFilters(user.getId(), issueType, status, pageable);

        List<Complaint> userComplaintList = complaintsPage.getContent();

        List<ComplaintRecordResponse> complaintRecordResponsesList = new ArrayList<>();

        for (Complaint complaint : userComplaintList) {
            ComplaintRecordResponse complaintRecordResponse = new ComplaintRecordResponse();
            complaintRecordResponse.setComplaintId(complaint.getId());
            complaintRecordResponse.setTitle(complaint.getTitle());
            complaintRecordResponse.setIssueType(complaint.getIssueType());
            complaintRecordResponse.setIssueStatus(complaint.getStatus());
            complaintRecordResponse.setPriority(complaint.getPriority());
            complaintRecordResponse.setCreatedAt(complaint.getCreatedAt());
            if (complaint.getWard() != null) complaintRecordResponse.setWardId(complaint.getWard().getId());
            complaintRecordResponsesList.add(complaintRecordResponse);
        }

        ComplaintPageResponse response = new ComplaintPageResponse();
        response.setSuccess(true);
        response.setMessage("Complaints fetched successfully.");
        response.setComplaints(complaintRecordResponsesList);
        response.setPage(complaintsPage.getNumber());
        response.setSize(complaintsPage.getSize());
        response.setTotalElements(complaintsPage.getTotalElements());
        response.setIsLast(complaintsPage.isLast());

        return response;
    }

    public ComplaintPageResponse showOfficerComplaints(int page, int size, Status status, Integer wardId) {
        User user = fetchAuthenticatedUser();

        validateOfficer(user);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Complaint> complaintsPage = complaintRepository.findByOfficerIdAndFilters(user.getId(), wardId, status, pageable);

        List<Complaint> officerComplaintList = complaintsPage.getContent();

        List<ComplaintRecordResponse> complaintRecordResponsesList = new ArrayList<>();

        for (Complaint complaint : officerComplaintList) {
            ComplaintRecordResponse complaintRecordResponse = new ComplaintRecordResponse();
            complaintRecordResponse.setComplaintId(complaint.getId());
            complaintRecordResponse.setTitle(complaint.getTitle());
            complaintRecordResponse.setIssueType(complaint.getIssueType());
            complaintRecordResponse.setPriority(complaint.getPriority());
            complaintRecordResponse.setIssueStatus(complaint.getStatus());
            complaintRecordResponse.setCreatedAt(complaint.getCreatedAt());
            complaintRecordResponse.setWardId(complaint.getWard().getId());
            complaintRecordResponsesList.add(complaintRecordResponse);
        }

        ComplaintPageResponse response = new ComplaintPageResponse();
        response.setSuccess(true);
        response.setMessage("Complaints fetched successfully.");
        response.setComplaints(complaintRecordResponsesList);
        response.setPage(complaintsPage.getNumber());
        response.setSize(complaintsPage.getSize());
        response.setTotalElements(complaintsPage.getTotalElements());
        response.setIsLast(complaintsPage.isLast());

        return response;
    }

    public ComplaintStartResponse initiateComplaintWork(int complaintId) {
        User officer = fetchAuthenticatedUser();

        validateOfficer(officer);
        Complaint complaint = getComplaintOrThrow(complaintId);

        if (complaint.getAssignedTo() == null)
            throw new ComplaintNotAssignedToOfficerException("Complaint is not assigned to any officer. Cannot initiate work until assignment is complete.");

        if (!complaint.getAssignedTo().getId().equals(officer.getId()))
            throw new OfficerMismatchException("Complaint is assigned to a different officer. You cannot initiate work on this complaint.");

        if (complaint.getStatus() == Status.REOPENED) {
            complaint.setCycleNumber(complaint.getCycleNumber() + 1);
        }

        LocalDateTime currentTime = LocalDateTime.now();
        updateStatusHistory(Status.IN_PROGRESS, complaint, currentTime, null, null, officer);

        Complaint updatedComplaint = complaintRepository.save(complaint);

        ComplaintStartResponse response = new ComplaintStartResponse();
        response.setSuccess(true);
        response.setComplaintId(updatedComplaint.getId());
        response.setMessage("Officer has begun working on the complaint. Status updated to IN_PROGRESS.");

        return response;
    }

    @Transactional
    public ComplaintCompletionResponse markComplaintCompletedByOfficer(int complaintId, List<MultipartFile> images, String remark) {
        User officer = fetchAuthenticatedUser();

        validateOfficer(officer);
        Complaint complaint = getComplaintOrThrow(complaintId);

        if (complaint.getAssignedTo() == null)
            throw new ComplaintNotAssignedToOfficerException("Complaint is not assigned to any officer. Cannot initiate work until assignment is complete.");

        if (!complaint.getAssignedTo().getId().equals(officer.getId()))
            throw new OfficerMismatchException("Complaint is assigned to a different officer. You cannot initiate work on this complaint.");

        if (complaint.getStatus() != Status.IN_PROGRESS && complaint.getStatus() != Status.REOPENED) {
            throw new ComplaintStatusMismatchException("Complaint must be IN_PROGRESS or REOPENED to mark as completed");
        }

        if (images == null || images.isEmpty())
            throw new ComplaintCompletionImagesMissingException("Completion work images are required before marking the complaint as completed. Please upload the necessary files.");

        imageValidator.validate(images);

        if (images.size() > 3) throw new MaxImageUploadExceededException("Maximum 3 Images are allowed");

        LocalDateTime currentTime = LocalDateTime.now();

        List<ImageMeta> currentComplaintImages = complaint.getImages();

        if (currentComplaintImages == null) {
            currentComplaintImages = new ArrayList<>();
        }

        Complaint updatedComplaint = null;
        List<ImageMeta> completionImages = new ArrayList<>();

        flowValidation.validateTransition(complaint.getStatus(), Status.PENDING_VERIFICATION);
        try {
            for (MultipartFile file : images) {
                ImageMeta imgMeta = uploadFile(file);
                imgMeta.setComplaint(complaint);
                imgMeta.setImageType(ImageType.AFTER);
                imgMeta.setCycleNumber(complaint.getCycleNumber());
                completionImages.add(imgMeta);
            }
            currentComplaintImages.addAll(completionImages);
            updateStatusHistory(Status.PENDING_VERIFICATION, complaint, currentTime, remark, null, officer);
            complaint.setImages(currentComplaintImages);
            updatedComplaint = complaintRepository.save(complaint);
        } catch (Exception e) {

            try {
                for (ImageMeta img : completionImages) {
                    deleteFile(img);
                }
            } catch (IOException e1) {
                System.out.println("Cloudinary Cleanup failed");
            }

            e.printStackTrace();
            throw new ComplaintSubmissionFailedException("Complaint submission failed: Please try again later.");
        }

        ComplaintCompletionResponse response = new ComplaintCompletionResponse();
        response.setSuccess(true);
        response.setMessage("Complaint marked as completed. Forwarded to citizen for verification.");
        response.setStatus(complaint.getStatus());
        response.setComplaintId(updatedComplaint.getId());

        if (complaint.getCreatedBy().getNotificationEnabled())
            emailService.sendComplaintPendingVerificationEmail(updatedComplaint.getCreatedBy().getFullName(), updatedComplaint.getCreatedBy().getEmail(), updatedComplaint.getId(), updatedComplaint.getIssueType(), updatedComplaint.getWard().getId(), updatedComplaint.getStatus());

        return response;
    }

    @Transactional
    public ComplaintResolutionResponse approveWorkDoneByCitizen(int complaintId) {
        User user = fetchAuthenticatedUser();
        Complaint complaint = getComplaintOrThrow(complaintId);

        validateCitizen(user);
        validateOwnership(complaint, user.getId());

        if (complaint.getStatus() != Status.PENDING_VERIFICATION)
            throw new ComplaintApprovalFailedException("Action denied: Complaint approval is only allowed when status is PENDING_VERIFICATION.");

        LocalDateTime currentTime = LocalDateTime.now();

        User officer = complaint.getAssignedTo();

        if (officer == null) {
            throw new ComplaintNotAssignedToOfficerException("Complaint cannot be marked as completed without being assigned to an officer");
        }

        updateStatusHistory(Status.CLOSED, complaint, currentTime, null, null, officer);

        complaint.setClosedAt(currentTime);

        Complaint approvedComplaint = complaintRepository.save(complaint);

        ComplaintResolutionResponse response = new ComplaintResolutionResponse();
        response.setComplaintId(approvedComplaint.getId());
        response.setCitizenName(approvedComplaint.getCreatedBy().getFullName());
        response.setSuccess(true);
        response.setMessage("Work completed and approved by citizen.");
        response.setStatus(approvedComplaint.getStatus());
        if (approvedComplaint.getAssignedTo() != null) {
            response.setOfficerName(approvedComplaint.getAssignedTo().getFullName());
        }
        response.setResolvedAt(approvedComplaint.getClosedAt());

        return response;
    }

    @Transactional
    public ComplaintRejectionResponse rejectWorkDoneByCitizen(int complaintId, ComplaintRejectionRequest complaintRejectionRequest) {
        User user = fetchAuthenticatedUser();
        Complaint complaint = getComplaintOrThrow(complaintId);

        validateCitizen(user);
        validateOwnership(complaint, user.getId());

        if (complaint.getStatus() != Status.PENDING_VERIFICATION)
            throw new ComplaintRejectionFailedException("Action denied: Complaint Rejection is only allowed when status is PENDING_VERIFICATION.");

        LocalDateTime currentTime = LocalDateTime.now();

        updateStatusHistory(Status.REOPENED, complaint, currentTime, complaintRejectionRequest.getRemark(), complaintRejectionRequest.getContactDetails(), null);

        Complaint rejectedComplaint = complaintRepository.save(complaint);

        ComplaintRejectionResponse response = new ComplaintRejectionResponse();
        response.setComplaintId(rejectedComplaint.getId());
        response.setSuccess(true);
        response.setCitizenName(rejectedComplaint.getCreatedBy().getFullName());

        if (rejectedComplaint.getAssignedTo() != null) {
            response.setOfficerName(rejectedComplaint.getAssignedTo().getFullName());
        }

        response.setStatus(rejectedComplaint.getStatus());
        response.setRejectedAt(rejectedComplaint.getLastUpdatedAt());
        response.setMessage("Complaint rejected. Your feedback and contact details recorded.");

        if (user.getNotificationEnabled())
            emailService.sendComplaintReopenedEmail(rejectedComplaint.getCreatedBy().getFullName(), rejectedComplaint.getCreatedBy().getEmail(), rejectedComplaint.getId(), rejectedComplaint.getIssueType(), rejectedComplaint.getWard().getId(), rejectedComplaint.getStatus());
        return response;
    }

    public ComplaintPageResponse getAllComplaintsForAdmin(int page, int size, Status status, Integer wardId, IssueType issueType) {
        User user = fetchAuthenticatedUser();

        validateAdmin(user);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Complaint> complaintsPage = complaintRepository.findAllComplaints(wardId, status, issueType, pageable);

        List<Complaint> complaintList = complaintsPage.getContent();

        List<ComplaintRecordResponse> complaintRecordResponsesList = new ArrayList<>();

        for (Complaint complaint : complaintList) {
            ComplaintRecordResponse complaintRecordResponse = new ComplaintRecordResponse();
            complaintRecordResponse.setComplaintId(complaint.getId());
            complaintRecordResponse.setTitle(complaint.getTitle());
            complaintRecordResponse.setIssueType(complaint.getIssueType());
            complaintRecordResponse.setIssueStatus(complaint.getStatus());
            complaintRecordResponse.setCreatedAt(complaint.getCreatedAt());
            complaintRecordResponse.setWardId(complaint.getWard().getId());
            complaintRecordResponse.setPriority(complaint.getPriority());
            complaintRecordResponsesList.add(complaintRecordResponse);
        }

        ComplaintPageResponse response = new ComplaintPageResponse();
        response.setSuccess(true);
        response.setMessage("Complaints fetched successfully.");
        response.setComplaints(complaintRecordResponsesList);
        response.setPage(complaintsPage.getNumber());
        response.setSize(complaintsPage.getSize());
        response.setTotalElements(complaintsPage.getTotalElements());
        response.setIsLast(complaintsPage.isLast());

        return response;
    }

    public ComplaintApprovedResponse markComplaintApprovedByAdmin(int complaintId) {
        Complaint complaint = getComplaintOrThrow(complaintId);
        User user = fetchAuthenticatedUser();

        validateAdmin(user);

        if (complaint.getStatus() != Status.CREATED) {
            throw new ComplaintAlreadyVerifiedException("Complaint is already verified by the admin");
        }

        LocalDateTime currentTime = LocalDateTime.now();

        updateStatusHistory(Status.APPROVED, complaint, currentTime, null, null, null);

        Complaint approvedComplaint = complaintRepository.save(complaint);

        ComplaintApprovedResponse response = new ComplaintApprovedResponse();
        response.setSuccess(true);
        response.setMessage("Complaint Approved Successfully.");
        response.setComplaintId(approvedComplaint.getId());
        response.setStatus(approvedComplaint.getStatus());
        response.setApprovedAt(currentTime);

        if (complaint.getCreatedBy().getNotificationEnabled())
            emailService.sendComplaintApprovedEmail(approvedComplaint.getCreatedBy().getFullName(), approvedComplaint.getCreatedBy().getEmail(), approvedComplaint.getId(), approvedComplaint.getIssueType(), approvedComplaint.getWard().getId(), approvedComplaint.getStatus());

        return response;
    }

    public ComplaintDisapprovedResponse markComplaintDisapprovedByAdmin(int complaintId) {
        Complaint complaint = getComplaintOrThrow(complaintId);
        User user = fetchAuthenticatedUser();

        validateAdmin(user);

        if (complaint.getStatus() != Status.CREATED) {
            throw new ComplaintAlreadyVerifiedException("Complaint is no longer eligible for admin rejection.");
        }

        LocalDateTime currentTime = LocalDateTime.now();

        updateStatusHistory(Status.REJECTED, complaint, currentTime, null, null, null);

        complaint.setClosedAt(currentTime);

        Complaint rejectedComplaint = complaintRepository.save(complaint);

        ComplaintDisapprovedResponse response = new ComplaintDisapprovedResponse();
        response.setComplaintId(rejectedComplaint.getId());
        response.setSuccess(true);
        response.setMessage("Complaint disapproved Successfully.");
        response.setStatus(Status.REJECTED);
        response.setRejectedAt(currentTime);

        if (user.getNotificationEnabled())
            emailService.sendComplaintDisapprovedEmail(rejectedComplaint.getCreatedBy().getFullName(), rejectedComplaint.getCreatedBy().getEmail(), rejectedComplaint.getId(), rejectedComplaint.getIssueType(), rejectedComplaint.getWard().getId(), rejectedComplaint.getStatus());
        return response;
    }

    public ComplaintAssignedResponse markComplaintAssignedToOfficer(int complaintId, int officerId) {
        User admin = fetchAuthenticatedUser();
        Complaint complaint = getComplaintOrThrow(complaintId);

        validateAdmin(admin);

        User officer = userRepository.findById(officerId).orElseThrow(() -> new UserNotFoundException("No Officer Found with this Id"));

        validateOfficer(officer);

        if (complaint.getStatus() != Status.APPROVED) {
            throw new ComplaintAssignmentFailedException("Only approved complaints can be assigned to officers.");
        }

        LocalDateTime currentTime = LocalDateTime.now();

        updateStatusHistory(Status.ASSIGNED, complaint, currentTime, null, null, officer);

        complaint.setAssignedTo(officer);

        Complaint assignedComplaint = complaintRepository.save(complaint);

        ComplaintAssignedResponse response = new ComplaintAssignedResponse();
        response.setSuccess(true);
        response.setMessage("Officer assigned successfully");
        response.setOfficerId(assignedComplaint.getAssignedTo().getId());
        response.setOfficerName(assignedComplaint.getAssignedTo().getFullName());
        response.setComplaintId(assignedComplaint.getId());

        emailService.sendComplaintAssignedEmail(assignedComplaint.getAssignedTo().getFullName(), assignedComplaint.getId(), assignedComplaint.getIssueType(), assignedComplaint.getWard().getId(), assignedComplaint.getPriority(), assignedComplaint.getLastUpdatedAt(), assignedComplaint.getAssignedTo().getEmail());

        return response;

    }

    @Scheduled(initialDelay = 5000, fixedDelay = 10000)
    @Transactional
    public void markComplaintAsAutoCompleted() {
        List<Complaint> pendingVerificationComplaints = complaintRepository.findByStatus(Status.PENDING_VERIFICATION);

        if (pendingVerificationComplaints == null || pendingVerificationComplaints.isEmpty()) {
            return;
        }

        for (Complaint complaint : pendingVerificationComplaints) {
            LocalDateTime currentDateTime = LocalDateTime.now();
            LocalDateTime lastUpdatedTime = complaint.getLastUpdatedAt();

            // Though we always have this field but still better to check for NPE
            if (lastUpdatedTime == null) continue;

            LocalDateTime maxAcceptWindowTime = lastUpdatedTime.plusDays(3);

            User assignedOfficer = complaint.getAssignedTo();

            if (assignedOfficer == null) {
                throw new ComplaintNotAssignedToOfficerException("Complaint cannot be marked as completed without being assigned to an officer");

            }

            if (currentDateTime.isAfter(maxAcceptWindowTime)) {
                updateStatusHistory(Status.AUTO_CLOSED, complaint, currentDateTime, null, null, assignedOfficer);
                complaint.setClosedAt(currentDateTime);
                Complaint autoClosedComplaint = complaintRepository.save(complaint);
                if (complaint.getCreatedBy().getNotificationEnabled())
                    emailService.sendComplaintAutoClosedEmail(autoClosedComplaint.getCreatedBy().getFullName(), autoClosedComplaint.getCreatedBy().getEmail(), autoClosedComplaint.getId(), autoClosedComplaint.getIssueType(), autoClosedComplaint.getWard().getId(), autoClosedComplaint.getStatus());
            }
        }
    }

    public ComplaintPriorityResponse updateComplaintPriorityByCouncillor(int complaintId, Priority priority) {
        User councillor = fetchAuthenticatedUser();

        validateCouncillor(councillor);
        Complaint complaint = getComplaintOrThrow(complaintId);

        if (complaint.getStatus() != Status.CREATED && complaint.getStatus() != Status.APPROVED && complaint.getStatus() != Status.ASSIGNED) {
            throw new ComplaintPriorityChangeForbiddenException("Complaint priority cannot be changed once resolution is in progress or completed.");
        }

        if (complaint.getWard().getCouncillor().getId() != councillor.getId()) {
            throw new UserMismatchException("Access violation: Cannot edit complaint priority for a different ward.");
        }

        Priority prevPriority = complaint.getPriority();

        complaint.setPriority(priority);

        complaint.setLastUpdatedAt(LocalDateTime.now());
        Complaint updatedComplaint = complaintRepository.save(complaint);

        ComplaintPriorityResponse response = new ComplaintPriorityResponse();
        response.setSuccess(true);
        response.setMessage("Complaint Priority changed");
        response.setComplaintId(updatedComplaint.getId());
        response.setPriority(updatedComplaint.getPriority());

        if (complaint.getCreatedBy().getNotificationEnabled())
            emailService.sendComplaintPriorityUpdateEmail(updatedComplaint.getAssignedTo().getFullName(), updatedComplaint.getId(), updatedComplaint.getIssueType(), updatedComplaint.getWard().getId(), prevPriority, updatedComplaint.getPriority(), updatedComplaint.getLastUpdatedAt(), updatedComplaint.getAssignedTo().getEmail());

        return response;
    }

    public ComplaintPageResponse getAllComplaintsForCouncillor(int page, int size, Status status, IssueType issueType) {
        User councilllor = fetchAuthenticatedUser();

        validateCouncillor(councilllor);

        Integer councillorWardId = councilllor.getCouncillorWard().getId();

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Complaint> complaintsPage = complaintRepository.findAllComplaints(councillorWardId, status, issueType, pageable);

        List<Complaint> complaintList = complaintsPage.getContent();

        List<ComplaintRecordResponse> complaintRecordResponsesList = new ArrayList<>();

        for (Complaint complaint : complaintList) {
            ComplaintRecordResponse complaintRecordResponse = new ComplaintRecordResponse();
            complaintRecordResponse.setComplaintId(complaint.getId());
            complaintRecordResponse.setTitle(complaint.getTitle());
            complaintRecordResponse.setIssueType(complaint.getIssueType());
            complaintRecordResponse.setIssueStatus(complaint.getStatus());
            complaintRecordResponse.setCreatedAt(complaint.getCreatedAt());
            complaintRecordResponse.setWardId(complaint.getWard().getId());
            complaintRecordResponse.setPriority(complaint.getPriority());
            complaintRecordResponsesList.add(complaintRecordResponse);
        }

        ComplaintPageResponse response = new ComplaintPageResponse();
        response.setSuccess(true);
        response.setMessage("Complaints fetched successfully.");
        response.setComplaints(complaintRecordResponsesList);
        response.setPage(complaintsPage.getNumber());
        response.setSize(complaintsPage.getSize());
        response.setTotalElements(complaintsPage.getTotalElements());
        response.setIsLast(complaintsPage.isLast());

        return response;
    }

    public ComplaintPageResponse getAllComplaintsByKeyword(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Integer complaintId = null;

        if (keyword == null || keyword.isBlank()) {
            ComplaintPageResponse response =
                    new ComplaintPageResponse();

            response.setSuccess(true);
            response.setMessage("No search keyword provided.");

            response.setComplaints(new ArrayList<>());

            response.setPage(pageable.getPageNumber());
            response.setSize(pageable.getPageSize());

            response.setTotalElements(0L);
            response.setIsLast(true);

            return response;
        }

        try {
            complaintId = Integer.parseInt(keyword);
        } catch (NumberFormatException e) {

        }

        keyword = keyword.trim();
        Page<Complaint> complaintsPage = complaintRepository.findByTitleContainingIgnoreCaseOrId(keyword, complaintId, pageable);
        List<Complaint> complaintList = complaintsPage.getContent();

        List<ComplaintRecordResponse> complaintRecordResponsesList = new ArrayList<>();

        for (Complaint complaint : complaintList) {
            ComplaintRecordResponse complaintRecordResponse = new ComplaintRecordResponse();
            complaintRecordResponse.setComplaintId(complaint.getId());
            complaintRecordResponse.setTitle(complaint.getTitle());
            complaintRecordResponse.setIssueType(complaint.getIssueType());
            complaintRecordResponse.setIssueStatus(complaint.getStatus());
            complaintRecordResponse.setCreatedAt(complaint.getCreatedAt());
            complaintRecordResponse.setWardId(complaint.getWard().getId());
            complaintRecordResponse.setPriority(complaint.getPriority());
            complaintRecordResponsesList.add(complaintRecordResponse);
        }

        ComplaintPageResponse response = new ComplaintPageResponse();
        response.setSuccess(true);
        response.setMessage("Complaints fetched successfully.");
        response.setComplaints(complaintRecordResponsesList);
        response.setPage(complaintsPage.getNumber());
        response.setSize(complaintsPage.getSize());
        response.setTotalElements(complaintsPage.getTotalElements());
        response.setIsLast(complaintsPage.isLast());

        return response;
    }

    public ComplaintPageResponse showOfficerResolvedComplaints(int page, int size, Status status, Integer wardId) {
        User user = fetchAuthenticatedUser();

        validateOfficer(user);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Complaint> complaintsPage = complaintRepository.findAllResolvedComplaints(user.getId(), wardId, status, pageable);

        List<Complaint> officerComplaintList = complaintsPage.getContent();

        List<ComplaintRecordResponse> complaintRecordResponsesList = new ArrayList<>();

        for (Complaint complaint : officerComplaintList) {
            ComplaintRecordResponse complaintRecordResponse = new ComplaintRecordResponse();
            complaintRecordResponse.setComplaintId(complaint.getId());
            complaintRecordResponse.setTitle(complaint.getTitle());
            complaintRecordResponse.setIssueType(complaint.getIssueType());
            complaintRecordResponse.setPriority(complaint.getPriority());
            complaintRecordResponse.setIssueStatus(complaint.getStatus());
            complaintRecordResponse.setCreatedAt(complaint.getCreatedAt());
            complaintRecordResponse.setWardId(complaint.getWard().getId());
            complaintRecordResponsesList.add(complaintRecordResponse);
        }

        ComplaintPageResponse response = new ComplaintPageResponse();
        response.setSuccess(true);
        response.setMessage("Complaints fetched successfully.");
        response.setComplaints(complaintRecordResponsesList);
        response.setPage(complaintsPage.getNumber());
        response.setSize(complaintsPage.getSize());
        response.setTotalElements(complaintsPage.getTotalElements());
        response.setIsLast(complaintsPage.isLast());

        return response;
    }

    public ComplaintPageResponse getAllResolvedComplaintsByKeyword(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Integer complaintId = null;

        if (keyword == null || keyword.isBlank()) {
            ComplaintPageResponse response =
                    new ComplaintPageResponse();

            response.setSuccess(true);
            response.setMessage("No search keyword provided.");

            response.setComplaints(new ArrayList<>());

            response.setPage(pageable.getPageNumber());
            response.setSize(pageable.getPageSize());

            response.setTotalElements(0L);
            response.setIsLast(true);

            return response;
        }

        try {
            complaintId = Integer.parseInt(keyword);
        } catch (NumberFormatException e) {

        }

        keyword = keyword.trim();
        Page<Complaint> complaintsPage = complaintRepository.findAllResolvedComplaintsByKeyword(keyword, complaintId, pageable);
        List<Complaint> complaintList = complaintsPage.getContent();

        List<ComplaintRecordResponse> complaintRecordResponsesList = new ArrayList<>();

        for (Complaint complaint : complaintList) {
            ComplaintRecordResponse complaintRecordResponse = new ComplaintRecordResponse();
            complaintRecordResponse.setComplaintId(complaint.getId());
            complaintRecordResponse.setTitle(complaint.getTitle());
            complaintRecordResponse.setIssueType(complaint.getIssueType());
            complaintRecordResponse.setIssueStatus(complaint.getStatus());
            complaintRecordResponse.setCreatedAt(complaint.getCreatedAt());
            complaintRecordResponse.setWardId(complaint.getWard().getId());
            complaintRecordResponse.setPriority(complaint.getPriority());
            complaintRecordResponsesList.add(complaintRecordResponse);
        }

        ComplaintPageResponse response = new ComplaintPageResponse();
        response.setSuccess(true);
        response.setMessage("Complaints fetched successfully.");
        response.setComplaints(complaintRecordResponsesList);
        response.setPage(complaintsPage.getNumber());
        response.setSize(complaintsPage.getSize());
        response.setTotalElements(complaintsPage.getTotalElements());
        response.setIsLast(complaintsPage.isLast());

        return response;
    }
}

