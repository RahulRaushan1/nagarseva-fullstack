package com.nagarseva.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OfficerComplaintDetails {
    private Integer activeComplaints;
    private Integer resolvedComplaints;
    private Integer pendingComplaints;
}
