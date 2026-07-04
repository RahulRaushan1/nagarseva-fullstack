package com.nagarseva.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ComplaintRejectionRequest {
    @NotBlank(message = "remarks can't be empty")
    private String remark;
    @NotBlank(message = "contactDetails can't be empty")
    private String contactDetails;
}
