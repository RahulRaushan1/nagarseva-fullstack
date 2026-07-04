package com.nagarseva.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterCitizenRequest {
    @Email
    @NotBlank(message = "Email is empty")
    private String email;
    @NotBlank(message = "Password is empty")
    private String password;
    @NotBlank(message = "Name is empty")
    private String fullName;
    @NotNull(message = "wardId is empty")
    private Integer wardId;
    @NotNull(message = "Email consent is required")
    private Boolean emailConsent;
}
