package com.nagarseva.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WorkOverviewDTO {
    private Long assignedCount;
    private Long inProgressCount;
    private Long pendingVerificationCount;
    private Long resolvedCount;
}
