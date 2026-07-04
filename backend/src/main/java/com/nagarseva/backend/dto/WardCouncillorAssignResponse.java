package com.nagarseva.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WardCouncillorAssignResponse {
    private Boolean success;
    private String message;
    private Integer wardId;
    private String councillorName;
}
