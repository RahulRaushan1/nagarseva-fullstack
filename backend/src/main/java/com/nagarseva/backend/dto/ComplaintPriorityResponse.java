package com.nagarseva.backend.dto;

import com.nagarseva.backend.enums.Priority;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ComplaintPriorityResponse {
    private Boolean success;
    private String message;
    private Integer complaintId;
    private Priority priority;
}

