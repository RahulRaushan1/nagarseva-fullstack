package com.nagarseva.backend.dto;

import com.nagarseva.backend.enums.IssueType;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class UpdateComplaintRequest {
    private String title;
    private IssueType issueType;
    private String desc;
    private Integer wardId;
    private List<String> imagePublicIds;
}
