package com.nagarseva.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DeleteComplaintResponse {
    private Boolean success;
    private String message;
    private Integer complaintId;
}
