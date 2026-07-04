package com.nagarseva.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WardSummaryDTO {
    private String wardName;
    private Integer wardId;
    private Long assignedOfficersCount;
}
