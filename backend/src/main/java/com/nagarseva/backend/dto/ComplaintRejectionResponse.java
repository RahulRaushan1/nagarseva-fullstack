package com.nagarseva.backend.dto;

import com.nagarseva.backend.enums.Status;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class ComplaintRejectionResponse {
    private Integer complaintId;
    private Boolean success;
    private String message;
    private String citizenName;
    private String officerName;
    private Status status;
    private LocalDateTime rejectedAt;
}
