package com.nagarseva.backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class OfficerDashboardResponse {
    private Boolean success;
    private String message;
    private Long assignedComplaints;
    private Long activeComplaints;
    private Long pendingVerificationComplaints;
    private Long resolvedComplaints;
    private WorkOverviewDTO workOverview;
    private List<RecentAssignedComplaintDTO> recentComplaints;
    private Long resolvedThisMonth;
    private Double averageResolutionDays;
    private String department;
    private Double completionRate;
}
