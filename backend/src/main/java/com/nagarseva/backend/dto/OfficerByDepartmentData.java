package com.nagarseva.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OfficerByDepartmentData {
    private String officerName;
    private Integer officerId;
    private Long activeComplaints;
    private Boolean isActive;
}
