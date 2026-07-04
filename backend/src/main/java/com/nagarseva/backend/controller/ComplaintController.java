package com.nagarseva.backend.controller;

import com.nagarseva.backend.dto.*;
import com.nagarseva.backend.enums.IssueType;
import com.nagarseva.backend.enums.Priority;
import com.nagarseva.backend.enums.Status;
import com.nagarseva.backend.service.ComplaintService;
import com.nagarseva.backend.validation.ComplaintUpdateValidator;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@AllArgsConstructor
@Validated
public class ComplaintController {

    private ComplaintService complaintService;
    private ComplaintUpdateValidator complaintUpdateValidator;

    @PostMapping("/citizen/complaint")
    public ResponseEntity<RegisterComplaintResponse> createNewComplaint(@Valid @ModelAttribute RegisterComplaintRequest registerComplaintRequest) throws IOException {
        RegisterComplaintResponse resp = complaintService.addNewComplaint(registerComplaintRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @PutMapping("/citizen/complaint/{id}")
    public ResponseEntity<UpdateComplaintResponse> updateComplaint(@PathVariable(name = "id") int complaintId, @Valid @ModelAttribute UpdateComplaintRequest updateComplaintRequest, @RequestParam(name = "newimages", required = false) List<MultipartFile> multipartFile) throws IOException {
        complaintUpdateValidator.validate(updateComplaintRequest,multipartFile);
        UpdateComplaintResponse resp = complaintService.updateComplaintCitizen(complaintId,updateComplaintRequest,multipartFile);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @GetMapping("/citizen/complaint/{id}")
    public ResponseEntity<ComplaintDetailsResponse> showSpecificComplaintsCitizen(@PathVariable(name = "id") int complaintId) {
        ComplaintDetailsResponse resp = complaintService.showComplaintsById(complaintId);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @GetMapping("/admin/complaint/{id}")
    public ResponseEntity<ComplaintDetailsResponse> showSpecificComplaintsAdmin(@PathVariable(name = "id") int complaintId) {
        ComplaintDetailsResponse resp = complaintService.showComplaintsById(complaintId);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @DeleteMapping("/citizen/complaint/{id}")
    public ResponseEntity<DeleteComplaintResponse> deleteComplaint(@PathVariable(name = "id") int complaintId) throws IOException {
        DeleteComplaintResponse resp = complaintService.deleteComplaintById(complaintId);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @GetMapping("/citizen/complaints")
    public ResponseEntity<ComplaintPageResponse> getUserComplaints(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) IssueType issueType
            ) {
        ComplaintPageResponse resp = complaintService.showUserComplaints(page, size, status, issueType);
        return ResponseEntity.status(HttpStatus.OK).body(resp);

    }

    @GetMapping("/officer/complaints")
    public ResponseEntity<ComplaintPageResponse> getOfficerComplaints(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Integer wardId
    ) {
        ComplaintPageResponse resp = complaintService.showOfficerComplaints(page, size, status, wardId);
        return ResponseEntity.status(HttpStatus.OK).body(resp);

    }

    @GetMapping("/officer/complaint/{id}")
    public ResponseEntity<ComplaintDetailsResponse> showSpecificComplaintsOfficer(@PathVariable(name = "id") int complaintId) {
        ComplaintDetailsResponse resp = complaintService.showComplaintsById(complaintId);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @PutMapping("/officer/complaint/{id}/start")
    public ResponseEntity<ComplaintStartResponse> beginComplaintProcessing(
            @PathVariable(name = "id") int complaintId
    ) {
        ComplaintStartResponse resp = complaintService.initiateComplaintWork(complaintId);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @PutMapping("/officer/complaint/{id}/finish")
    public ResponseEntity<ComplaintCompletionResponse> finishComplaintProcessing(
            @PathVariable(name = "id") int complaintId,
            @RequestParam(name = "images") List<MultipartFile> images,
            @RequestParam(name = "remark", required = false) String remarks

    ) {
        ComplaintCompletionResponse resp = complaintService.markComplaintCompletedByOfficer(complaintId, images, remarks);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @PutMapping("/citizen/complaint/{id}/accept")
    public ResponseEntity<ComplaintResolutionResponse> approveComplaintCompletionByCitizen(
            @PathVariable(name = "id") int complaintId
    ) {
        ComplaintResolutionResponse resp = complaintService.approveWorkDoneByCitizen(complaintId);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @PutMapping("/citizen/complaint/{id}/reject")
    public ResponseEntity<ComplaintRejectionResponse> rejectComplaintCompletionByCitizen(
            @PathVariable(name = "id") int complaintId,
            @Valid
            @RequestBody ComplaintRejectionRequest complaintRejectionRequest
    ) {
        ComplaintRejectionResponse resp = complaintService.rejectWorkDoneByCitizen(complaintId, complaintRejectionRequest);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @GetMapping("/admin/complaints")
    public ResponseEntity<ComplaintPageResponse> showAllComplaintsAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Integer wardId,
            @RequestParam(required = false) IssueType issueType
    ) {
        ComplaintPageResponse resp = complaintService.getAllComplaintsForAdmin(page, size, status, wardId, issueType);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @GetMapping("/admin/complaints/search")
    public ResponseEntity<ComplaintPageResponse> showAllComplaintsAdmin_Keyword(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(required = false) String keyword
    ) {
        ComplaintPageResponse resp = complaintService.getAllComplaintsByKeyword(page, size, keyword);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }
    @GetMapping("/officer/complaints/search")
    public ResponseEntity<ComplaintPageResponse> showAllComplaintsOfficer_Keyword(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(required = false) String keyword
    ) {
        ComplaintPageResponse resp = complaintService.getAllComplaintsByKeyword(page, size, keyword);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @GetMapping("/citizen/complaints/search")
    public ResponseEntity<ComplaintPageResponse> showAllComplaintsCitizen_Keyword(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(required = false) String keyword
    ) {
        ComplaintPageResponse resp = complaintService.getAllComplaintsByKeyword(page, size, keyword);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @GetMapping("/councillor/complaints/search")
    public ResponseEntity<ComplaintPageResponse> showAllComplaintsCouncillor_Keyword(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(required = false) String keyword
    ) {
        ComplaintPageResponse resp = complaintService.getAllComplaintsByKeyword(page, size, keyword);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @PutMapping("/admin/complaint/{id}/approve")
    public ResponseEntity<ComplaintApprovedResponse> approveCitizenComplaintByAdmin(
            @PathVariable(name = "id") int complaintId
    ) {
        ComplaintApprovedResponse resp = complaintService.markComplaintApprovedByAdmin(complaintId);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @PutMapping("/admin/complaint/{id}/reject")
    public ResponseEntity<ComplaintDisapprovedResponse> disapproveCitizenComplaintByAdmin(
            @PathVariable(name = "id") int complaintId
    ) {
        ComplaintDisapprovedResponse resp = complaintService.markComplaintDisapprovedByAdmin(complaintId);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @PutMapping("/admin/complaint/{id}/assign")
    public ResponseEntity<ComplaintAssignedResponse> assignOfficerToComplaintByAdmin(
            @PathVariable(name = "id") int complaintId,
            @RequestParam(name = "offId") int officerId
    ) {
        ComplaintAssignedResponse resp = complaintService.markComplaintAssignedToOfficer(complaintId, officerId);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @GetMapping("/councillor/complaints")
    public ResponseEntity<ComplaintPageResponse> showAllComplaintsCouncillor(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) IssueType issueType
    ) {
        ComplaintPageResponse resp = complaintService.getAllComplaintsForCouncillor(page, size, status, issueType);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @GetMapping("/councillor/complaint/{id}")
    public ResponseEntity<ComplaintDetailsResponse> showSpecificComplaintsCouncillor(@PathVariable(name = "id") int complaintId) {
        ComplaintDetailsResponse resp = complaintService.showComplaintsById(complaintId);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @PutMapping("/councillor/complaint/{id}")
    public ResponseEntity<ComplaintPriorityResponse> adjustComplaintPriorityByCouncillor(
            @PathVariable(name = "id") int complaintId,
            @RequestParam(name = "priority") Priority priority
            ) {
        ComplaintPriorityResponse resp = complaintService.updateComplaintPriorityByCouncillor(complaintId, priority);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @GetMapping("/officer/complaints/resolved")
    public ResponseEntity<ComplaintPageResponse> getOfficerResolvedComplaints(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Integer wardId
    ) {
        ComplaintPageResponse resp = complaintService.showOfficerResolvedComplaints(page, size, status, wardId);
        return ResponseEntity.status(HttpStatus.OK).body(resp);

    }

    @GetMapping("/officer/complaints/resolved/search")
    public ResponseEntity<ComplaintPageResponse> showAllResolvedComplaintsOfficer_Keyword(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(required = false) String keyword
    ) {
        ComplaintPageResponse resp = complaintService.getAllResolvedComplaintsByKeyword(page, size, keyword);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

}
