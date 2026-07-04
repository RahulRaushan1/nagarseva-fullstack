package com.nagarseva.backend.controller;

import com.nagarseva.backend.dto.*;
import com.nagarseva.backend.service.AuthService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@Validated
@CrossOrigin(origins = "http://localhost:5173/")
public class AuthController {

    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<RegisterCitizenResponse> registerCitizen(@Valid @RequestBody RegisterCitizenRequest registerCitizenRequest) {
        RegisterCitizenResponse resp = authService.createNewCitizenAccount(registerCitizenRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginUserResponse> loginUser(@Valid @RequestBody LoginUserRequest loginUserRequest) {
        LoginUserResponse resp = authService.authenticateUser(loginUserRequest);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<OTPGeneratedResponse> forgotPassword(@RequestParam @NotBlank @Email String email) {
        OTPGeneratedResponse resp = authService.generateOtpForForgotPassword(email);
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<OTPGeneratedResponse> validateOTPAndResetPassword(@RequestBody ForgotPasswordRequest forgotPasswordRequest) {
        OTPGeneratedResponse resp = authService.validateOTP(forgotPasswordRequest);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

}
