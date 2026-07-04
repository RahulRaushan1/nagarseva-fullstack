package com.nagarseva.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WardInsightDTO {
    private String mostReportedIssue;
    private Integer wardId;
    private Long totalComplaintsInWard;
    private Long citizenContributionCount;
}
