package com.nagarseva.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CitizenProfileResponse {
    private boolean success;
    private String message;
    private Integer id;
    private String fullName;
    private String email;
    private String role;
    private Integer wardId;
    private String wardName;
    private Boolean notificationEnabled;
}
