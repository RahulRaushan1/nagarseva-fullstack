package com.nagarseva.backend.dto;

import com.nagarseva.backend.enums.Department;
import com.nagarseva.backend.enums.Status;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OfficerDataDTO {
    private Integer id;
    private String fullName;
    private Department department;
    private boolean active;

    private Long pendingCount;
    private Long activeCount;
    private Long resolvedCount;

    public OfficerDataDTO(Integer id, String fullName, Department department, boolean active, Long pendingCount, Long activeCount, Long resolvedCount) {
        this.id = id;
        this.fullName = fullName;
        this.department = department;
        this.active = active;
        this.pendingCount = pendingCount;
        this.activeCount = activeCount;
        this.resolvedCount = resolvedCount;
    }
}
