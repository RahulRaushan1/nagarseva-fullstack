package com.nagarseva.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class HealthResponse {
    private Boolean success;
    private String message;
    private LocalDateTime timestamp;

}
