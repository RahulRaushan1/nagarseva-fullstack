package com.nagarseva.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ComplaintOverviewDTO {
    private Long activeCount;
    private Long resolvedCount;
    private Long pendingVerificationCount;
    private Long reopenedCount;
}
