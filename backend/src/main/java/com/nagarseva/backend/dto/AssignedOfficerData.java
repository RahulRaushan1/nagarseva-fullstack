package com.nagarseva.backend.dto;

import com.nagarseva.backend.enums.Department;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AssignedOfficerData {
    private String officerName;
    private Department officerDepartment;
    private Boolean active;
}
