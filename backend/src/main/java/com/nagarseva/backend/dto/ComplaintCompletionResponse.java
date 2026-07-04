package com.nagarseva.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.nagarseva.backend.enums.Status;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ComplaintCompletionResponse {
    private Boolean success;
    private String message;
    private Integer complaintId;
    private Status status;
}
