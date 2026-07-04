package com.nagarseva.backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class CouncillorDashboardResponse {
    private Boolean success;
    private String message;
    private Long totalComplaints;
    private Long activeComplaints;
    private Long resolvedComplaints;
    private Long reopenedComplaints;
    private ComplaintOverviewDTO complaintOverview;
    private List<RecentComplaintDTO> recentComplaints;
    private WardSummaryDTO wardSummary;
}
