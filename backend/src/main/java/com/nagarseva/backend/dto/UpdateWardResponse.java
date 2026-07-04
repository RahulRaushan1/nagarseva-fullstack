package com.nagarseva.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateWardResponse {
    private Boolean success;
    private String message;
    private Integer wardId;
}
