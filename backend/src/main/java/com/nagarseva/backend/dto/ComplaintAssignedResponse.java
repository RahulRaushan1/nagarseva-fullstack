package com.nagarseva.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ComplaintAssignedResponse {
    private Boolean success;
    private String message;
    private Integer complaintId;
    private Integer officerId;
    private String officerName;
}
