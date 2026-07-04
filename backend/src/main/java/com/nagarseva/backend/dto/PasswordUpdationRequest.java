package com.nagarseva.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordUpdationRequest {
    private String oldPassword;
    @NotBlank
    private String newPassword;

}
