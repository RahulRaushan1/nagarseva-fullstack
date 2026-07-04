package com.nagarseva.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AdminDashboardResponse {
    private Boolean success;
    private String message;
    private Integer totalUsers;
    private Integer totalComplaints;
    private Integer totalWards;
    private Integer totalOfficers;
    private List<IssueSummary> issueSummary;
    private List<DepartmentPerformance> departmentPerformance;
    private List<WardAnalysis> wardAnalyses;
}
