package com.nagarseva.backend.dto;

import com.nagarseva.backend.enums.IssueType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IssueSummary {
    private IssueType issueType;
    private Integer complaintsCounts;
}
