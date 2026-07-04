package com.nagarseva.backend.dto;

import com.nagarseva.backend.enums.Department;
import com.nagarseva.backend.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterUserRequest {
    @NotBlank(message = "Email is required")
    @Email
    private String email;
    @NotBlank(message = "Password is required")
    private String password;
    @NotBlank(message = "Name is required")
    private String fullName;
    @NotNull(message = "Role is required")
    private Role role;
    private Department department;
}
