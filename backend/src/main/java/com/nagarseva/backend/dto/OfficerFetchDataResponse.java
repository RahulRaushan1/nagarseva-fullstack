package com.nagarseva.backend.dto;

import com.nagarseva.backend.enums.Department;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OfficerFetchDataResponse {
    private Integer id;
    private String name;
    private Department department;
    private String profileImage;
    private Long activeComplaints;
    private Long resolvedComplaints;
    private Long pendingComplaints;
    private Boolean active;
}
