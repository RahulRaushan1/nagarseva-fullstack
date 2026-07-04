package com.nagarseva.backend.dto;

import com.nagarseva.backend.enums.Department;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DepartmentPerformance {
    private Department department;
    private Integer activeCount;
    private Integer resolvedCount;
    private Integer pendingCount;
}
