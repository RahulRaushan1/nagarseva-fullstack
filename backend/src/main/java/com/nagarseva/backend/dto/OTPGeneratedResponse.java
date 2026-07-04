package com.nagarseva.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OTPGeneratedResponse {
    private Boolean success;
    private String message;
}
