package com.nagarseva.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateAccountStatusResponse {
    private Boolean success;
    private String message;
    private Integer userId;
    private String currentStatus;
}
