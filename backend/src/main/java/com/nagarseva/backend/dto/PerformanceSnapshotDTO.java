package com.nagarseva.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PerformanceSnapshotDTO {
    private Long resolvedThisMonthCount;
    private Double averageResolutionTimeDays;
    private String departmentName;
    private Double completionRate;
}
