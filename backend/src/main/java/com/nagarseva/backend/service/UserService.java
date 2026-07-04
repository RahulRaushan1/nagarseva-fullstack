package com.nagarseva.backend.service;

import com.nagarseva.backend.dto.*;
import com.nagarseva.backend.entity.Complaint;
import com.nagarseva.backend.entity.User;
import com.nagarseva.backend.entity.Ward;
import com.nagarseva.backend.enums.Department;
import com.nagarseva.backend.enums.Role;
import com.nagarseva.backend.enums.Status;
import com.nagarseva.backend.exception.*;
import com.nagarseva.backend.repository.UserRepository;
import com.nagarseva.backend.repository.WardRepository;
import com.nagarseva.backend.security.CustomUserDetails;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
public class UserService {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private EmailService emailService;
    private WardRepository wardRepository;
    private ComplaintService complaintService;

    private Ward getWardOrThrow(int wardId) {
        return wardRepository.findById(wardId).orElseThrow(
                () -> new InvalidWardException("No Ward Exists by this Id")
        );
    }

    private void validateAdmin(User user) {
        if (!user.getRole().equals(Role.ADMIN)) {
            throw new InvalidUserRoleException("Invalid User! Only Officer are allowed");
        }
    }

    private User fetchAuthenticatedUser() {
        CustomUserDetails user = (CustomUserDetails) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        return user.getUser();

    }

    public PasswordUpdationResponse updateUserPassword(PasswordUpdationRequest passwordUpdationRequest) {
        CustomUserDetails user = (CustomUserDetails) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        User updatedUser = userRepository.findByEmail(user.getUsername()).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        if (!user.isDefaultPassword()) {
            if (passwordUpdationRequest.getOldPassword() == null || passwordUpdationRequest.getOldPassword().isEmpty())
                throw new InvalidPasswordException("Kindly Enter the old password");

            boolean passwordMatches = passwordEncoder.matches(passwordUpdationRequest.getOldPassword(), updatedUser.getPassword());

            if (!passwordMatches)
                throw new InvalidPasswordException("Entered password does not match the current password. Please try again.");
        }

        updatedUser.setPassword(passwordEncoder.encode(passwordUpdationRequest.getNewPassword()));
        updatedUser.setDefaultPassword(false);

        userRepository.save(updatedUser);

        PasswordUpdationResponse response = new PasswordUpdationResponse();
        response.setSuccess(true);
        response.setMessage("Password Updated Successfully");

        return response;
    }

    public RegisterUserResponse addNewUser(RegisterUserRequest registerUserRequest) {
        if (userRepository.existsByEmail(registerUserRequest.getEmail())) {
            throw new UserAlreadyExistsException("Username Already Taken.");
        }

        if (registerUserRequest.getRole().equals(Role.CITIZEN)) {
            throw new InvalidUserCreationException("Action not allowed: Admins are not permitted to create Citizen accounts");
        }

        if (registerUserRequest.getRole() == Role.OFFICER && registerUserRequest.getDepartment() == null) {
            throw new MissingDepartmentException("Department field is required but missing");
        }

        User user = new User();
        user.setEmail(registerUserRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerUserRequest.getPassword()));
        user.setFullName(registerUserRequest.getFullName());
        user.setRole(registerUserRequest.getRole());
        user.setDefaultPassword(true);
        user.setActive(true);
        user.setNotificationEnabled(true);

        if (registerUserRequest.getRole().equals(Role.OFFICER) && registerUserRequest.getDepartment() == null)
            throw new MissingDepartmentException("Department must be provided while creating a OFFICER.");

        if (registerUserRequest.getRole().equals(Role.OFFICER)) {
            user.setDepartment(registerUserRequest.getDepartment());
        }

        User savedUser = userRepository.save(user);

        RegisterUserResponse response = new RegisterUserResponse();
        response.setSuccess(true);
        response.setEmail(savedUser.getEmail());
        response.setMessage("Account Created Successfully.");
        response.setRole(registerUserRequest.getRole());

        if (!passwordEncoder.matches(registerUserRequest.getPassword(), savedUser.getPassword())) {
            throw new InvalidPasswordException("Password mismatch with Stored one");
        }

        emailService.sendOfficialRegistrationSuccessEmail(savedUser.getFullName(), savedUser.getEmail(), savedUser.getRole(), registerUserRequest.getPassword());

        return response;
    }

    @Transactional
    public PasswordUpdationResponse resetUserPassword(PasswordResetRequest passwordResetRequest) {
        User user = userRepository.findByEmail(passwordResetRequest.getEmail()).orElseThrow(
                () -> new UserNotFoundException("No User Found with this email")
        );

        LocalDateTime current = LocalDateTime.now();

        if (user.getResetOtpVerifiedUntil() == null) {
            throw new OTPNotGeneratedException("No OTP has been generated. Please generate one first.");
        }

        if (current.isAfter(user.getResetOtpVerifiedUntil())) {
            throw new ResetPasswordWindowExceededException("Password reset window exceeded. Please generate a new OTP");
        }

        user.setPassword(passwordEncoder.encode(passwordResetRequest.getNewPassword()));

        user.setResetOtp(null);
        user.setResetOtpExpiry(null);
        user.setResetOtpVerifiedUntil(null);

        User updatedUser = userRepository.save(user);

        PasswordUpdationResponse response = new PasswordUpdationResponse();
        response.setSuccess(true);
        response.setMessage("Password changed successfully");

        if (user.getNotificationEnabled())
            emailService.sendPasswordChangedConfirmationEmail(updatedUser.getFullName(), updatedUser.getEmail(), current);
        return response;
    }

    public OfficerFetchResponse getAllOfficer(int page, int size, Department department) {
        User admin = fetchAuthenticatedUser();

        validateAdmin(admin);

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("id").ascending()
        );

        Page<OfficerDataDTO> officerPage = userRepository.findAllOfficers(department, Role.OFFICER, pageable);
        List<OfficerDataDTO> officerList = officerPage.getContent();

        List<OfficerFetchDataResponse> officerFetchDataResponsesList = new ArrayList<>();

        for (OfficerDataDTO officer: officerList) {
            OfficerFetchDataResponse officerFetchDataResponse = new OfficerFetchDataResponse();
            officerFetchDataResponse.setId(officer.getId());
            officerFetchDataResponse.setName(officer.getFullName());
            officerFetchDataResponse.setDepartment(officer.getDepartment());
            officerFetchDataResponse.setActive(officer.isActive());
            officerFetchDataResponse.setProfileImage("/will be added soon");
            officerFetchDataResponse.setPendingComplaints(officer.getPendingCount());
            officerFetchDataResponse.setActiveComplaints(officer.getActiveCount());
            officerFetchDataResponse.setResolvedComplaints(officer.getResolvedCount());

            officerFetchDataResponsesList.add(officerFetchDataResponse);
        }

        OfficerFetchResponse officerFetchResponse = new OfficerFetchResponse();
        officerFetchResponse.setSuccess(true);
        officerFetchResponse.setMessage("Officer fetched successfully");
        officerFetchResponse.setSize(officerPage.getSize());
        officerFetchResponse.setPage(officerPage.getNumber());
        officerFetchResponse.setTotalElements(officerPage.getTotalElements());
        officerFetchResponse.setIsLast(officerPage.isLast());
        officerFetchResponse.setOfficers(officerFetchDataResponsesList);

        return officerFetchResponse;
    }

    public CouncillorFetchResponse getAllCouncillor() {
        User admin = fetchAuthenticatedUser();
        validateAdmin(admin);

        List<User> wardCouncillorsList = userRepository.findAllByRole(Role.COUNCILLOR);

        if (wardCouncillorsList.isEmpty()) {
            throw new UserNotFoundException("No ward councillor exists!");
        }

        List<CouncillorFetchData> councillorFetchData =  new ArrayList<>();

        for (User councillor: wardCouncillorsList) {
            councillorFetchData.add(new CouncillorFetchData(councillor.getId(), councillor.getFullName()));
        }

        CouncillorFetchResponse response = new CouncillorFetchResponse();
        response.setSuccess(true);
        response.setMessage("Councillor fetched successfully");
        response.setCouncillorList(councillorFetchData);

        return response;
    }

    public OfficerByDepartmentResponse getOfficerByDepartment(@NotBlank String department) {
        User admin = fetchAuthenticatedUser();

        validateAdmin(admin);

        Department.valueOf(department);

        List<OfficerSummaryDataDTO> officers = userRepository.findAllOfficerByDepartment(Department.valueOf(department));

        List<OfficerByDepartmentData> officerResponseList = new ArrayList<>();

        for (OfficerSummaryDataDTO officer : officers) {
            OfficerByDepartmentData officerByDepartmentData = new OfficerByDepartmentData();
            officerByDepartmentData.setOfficerName(officer.getFullName());
            officerByDepartmentData.setIsActive(officer.getActive());
            officerByDepartmentData.setOfficerId(officer.getId());
            officerByDepartmentData.setActiveComplaints(officer.getActiveComplaintCount());
            officerResponseList.add(officerByDepartmentData);
        }

        System.out.println();

        OfficerByDepartmentResponse response = new OfficerByDepartmentResponse();
        response.setSuccess(true);
        response.setMessage("Officer fetched successfully");
        response.setOfficers(officerResponseList);

        return response;
    }

    public CitizenProfileResponse getCitizenProfile() {
        User user = fetchAuthenticatedUser();

        CitizenProfileResponse response = new CitizenProfileResponse();
        response.setSuccess(true);
        response.setMessage("Profile fetched successfully");
        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());
        response.setNotificationEnabled(user.getNotificationEnabled());

        if (user.getRole().name().equals("COUNCILLOR") && user.getCouncillorWard() != null) {
            response.setWardId(user.getCouncillorWard().getId());
            response.setWardName(user.getCouncillorWard().getWardName());
        } else if (user.getCitizensWard() != null) {
            response.setWardId(user.getCitizensWard().getId());
            response.setWardName(user.getCitizensWard().getWardName());
        }

        return response;
    }

    public CitizenProfileUpdateResponse updateUserProfile(Integer id, Boolean notificationEnabled) {
        User citizen = fetchAuthenticatedUser();

        if (citizen.getNotificationEnabled() != notificationEnabled) {
            citizen.setNotificationEnabled(notificationEnabled);

            User updatedCitizen = userRepository.save(citizen);

        }

        CitizenProfileUpdateResponse citizenProfileUpdateResponse = new CitizenProfileUpdateResponse();
        citizenProfileUpdateResponse.setSuccess(true);
        citizenProfileUpdateResponse.setMessage("Profile preference updated successfully");

        return citizenProfileUpdateResponse;
    }

    public OfficerFetchResponse getAllOfficerByKeyword(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());


        if (keyword == null || keyword.isBlank()) {
            OfficerFetchResponse response =
                    new OfficerFetchResponse();

            response.setSuccess(true);
            response.setMessage("No search keyword provided.");

            response.setOfficers(new ArrayList<>());

            response.setPage(pageable.getPageNumber());
            response.setSize(pageable.getPageSize());

            response.setTotalElements(0L);
            response.setIsLast(true);

            return response;
        }

        Integer officerId = null;
        try {
            officerId = Integer.parseInt(keyword);
        } catch (NumberFormatException e) {

        }

        keyword = keyword.trim();
        Page<OfficerDataDTO> officerPage = userRepository.findAllOfficersByKeyword(keyword, officerId, pageable);

        List<OfficerDataDTO> officerList = officerPage.getContent();

        List<OfficerFetchDataResponse> officerFetchDataResponsesList = new ArrayList<>();

        for (OfficerDataDTO officer: officerList) {
            OfficerFetchDataResponse officerFetchDataResponse = new OfficerFetchDataResponse();
            officerFetchDataResponse.setId(officer.getId());
            officerFetchDataResponse.setName(officer.getFullName());
            officerFetchDataResponse.setDepartment(officer.getDepartment());
            officerFetchDataResponse.setProfileImage("/will be added soon");
            officerFetchDataResponse.setPendingComplaints(officer.getPendingCount());
            officerFetchDataResponse.setActiveComplaints(officer.getActiveCount());
            officerFetchDataResponse.setResolvedComplaints(officer.getResolvedCount());

            officerFetchDataResponsesList.add(officerFetchDataResponse);
        }

        OfficerFetchResponse officerFetchResponse = new OfficerFetchResponse();
        officerFetchResponse.setSuccess(true);
        officerFetchResponse.setMessage("Officer fetched successfully");
        officerFetchResponse.setSize(officerPage.getSize());
        officerFetchResponse.setPage(officerPage.getNumber());
        officerFetchResponse.setTotalElements(officerPage.getTotalElements());
        officerFetchResponse.setIsLast(officerPage.isLast());
        officerFetchResponse.setOfficers(officerFetchDataResponsesList);

        return officerFetchResponse;


    }

    public UpdateAccountStatusResponse updateUserAccountStatus(Integer userId, Boolean status) {

        User admin = fetchAuthenticatedUser();

        validateAdmin(admin);

        User user = userRepository.findById(userId).orElseThrow(
                () -> new UserNotFoundException("No user exists with this Id")
        );

        user.setActive(status);

        User updatedUser = userRepository.save(user);

        UpdateAccountStatusResponse updateAccountStatusResponse = new UpdateAccountStatusResponse();
        updateAccountStatusResponse.setSuccess(true);
        updateAccountStatusResponse.setMessage("User account status updated");
        updateAccountStatusResponse.setUserId(updatedUser.getId());
        updateAccountStatusResponse.setCurrentStatus(updatedUser.isActive()? "ENABLED" : "DISABLED");

        return updateAccountStatusResponse;
    }
}
