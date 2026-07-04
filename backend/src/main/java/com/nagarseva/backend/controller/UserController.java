package com.nagarseva.backend.controller;

import com.nagarseva.backend.dto.*;
import com.nagarseva.backend.enums.Department;
import com.nagarseva.backend.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@Validated
public class UserController {

    private UserService userService;

    @PostMapping("/admin/user")
    public ResponseEntity<RegisterUserResponse> createNewUser(@Valid @RequestBody RegisterUserRequest registerUserRequest) {
        RegisterUserResponse resp = userService.addNewUser(registerUserRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @PutMapping("/change-password")
    public ResponseEntity<PasswordUpdationResponse> updatePassword(@Valid @RequestBody PasswordUpdationRequest passwordUpdationRequest) {
        PasswordUpdationResponse resp =  userService.updateUserPassword(passwordUpdationRequest);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @PutMapping("/reset-password")
    public ResponseEntity<PasswordUpdationResponse> resetPassword(@Valid @RequestBody PasswordResetRequest passwordResetRequest) {
        PasswordUpdationResponse resp = userService.resetUserPassword(passwordResetRequest);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @GetMapping("/admin/officers")
    public ResponseEntity<OfficerFetchResponse> showAllOfficerAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(required = false) Department department
            ) {
        OfficerFetchResponse resp = userService.getAllOfficer(page,size,department);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @GetMapping("/admin/councillors")
    public ResponseEntity<CouncillorFetchResponse> showAllCouncillors() {
        CouncillorFetchResponse resp = userService.getAllCouncillor();
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @GetMapping("/admin/departments/officers")
    public ResponseEntity<OfficerByDepartmentResponse> showOfficerByDepartment(
            @RequestParam(name = "department") @NotBlank String department
    ) {
        OfficerByDepartmentResponse resp = userService.getOfficerByDepartment(department);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @GetMapping("/citizen/profile")
    public ResponseEntity<CitizenProfileResponse> getCitizenProfile() {
        CitizenProfileResponse resp = userService.getCitizenProfile();
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @GetMapping("/councillor/profile")
    public ResponseEntity<CitizenProfileResponse> getCouncillorProfile() {
        CitizenProfileResponse resp = userService.getCitizenProfile();
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @PutMapping("/citizen/profile/{id}")
    public ResponseEntity<CitizenProfileUpdateResponse> updateCitizenProfile(
            @PathVariable(name = "id") Integer id,
            @RequestParam(name = "notificationsEnabled", required = false) Boolean notificationEnabled
    ) {
        CitizenProfileUpdateResponse resp = userService.updateUserProfile(id,notificationEnabled);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @GetMapping("/admin/officers/search")
    public ResponseEntity<OfficerFetchResponse> showAllOfficerAdmin_ByKeyword(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(required = false) String keyword
    ) {
        OfficerFetchResponse resp = userService.getAllOfficerByKeyword(page,size,keyword);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @PutMapping("/admin/user/{id}/status")
    public ResponseEntity<UpdateAccountStatusResponse> setAccountStatus(
            @PathVariable(name = "id") Integer userId,
            @RequestParam(name = "active") Boolean active
    ) {
        UpdateAccountStatusResponse resp = userService.updateUserAccountStatus(userId, active);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }


}
