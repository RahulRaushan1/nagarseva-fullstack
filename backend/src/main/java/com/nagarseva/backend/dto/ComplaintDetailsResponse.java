package com.nagarseva.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.nagarseva.backend.enums.IssueType;
import com.nagarseva.backend.enums.Priority;
import com.nagarseva.backend.enums.Status;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ComplaintDetailsResponse {

    private Boolean success;
    private String message;

    private Integer complaintId;

    private String title;
    private String description;

    private IssueType issueType;
    private Status issueStatus;

    private WardResponseData ward;
    private AssignedOfficerData assignedTo;

    private CitizenInfo citizenInfo;

    private List<ImageResponse> complaintRaisedImages;

    private List<ComplaintCycleResponse> cycles;

    private LocalDateTime createdAt;

    private Priority priority;

    private LocationResponse locationResponse;
}
