package com.nagarseva.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.nagarseva.backend.enums.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RegisterUserResponse {
    private Boolean success;
    private String message;
    private String email;
    private Role role;
}
