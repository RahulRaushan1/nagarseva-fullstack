package com.nagarseva.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class ComplaintCycleResponse {

    private Integer cycleNumber;

    private Boolean currentCycle;

    private String officerRemarks;
    private List<ImageResponse> completionImages;

    private String citizenRemarks;
    private String citizenContactDetails;

    private LocalDateTime submittedAt;

}
