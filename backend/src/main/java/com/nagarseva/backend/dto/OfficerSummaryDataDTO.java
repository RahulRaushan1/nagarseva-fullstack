package com.nagarseva.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OfficerSummaryDataDTO {
    public Boolean active;
    public Integer id;
    private String fullName;
    private Long activeComplaintCount;

    public OfficerSummaryDataDTO(Boolean active, Integer id, String fullName, Long activeComplaintCount) {
        this.active = active;
        this.id = id;
        this.fullName = fullName;
        this.activeComplaintCount = activeComplaintCount;
    }
}
