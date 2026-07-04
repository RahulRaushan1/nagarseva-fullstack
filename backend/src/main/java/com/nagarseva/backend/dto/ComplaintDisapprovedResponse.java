package com.nagarseva.backend.dto;

import com.nagarseva.backend.enums.Status;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class ComplaintDisapprovedResponse {
    private Boolean success;
    private String message;
    private Integer complaintId;
    private Status status;
    private LocalDateTime rejectedAt;
}
