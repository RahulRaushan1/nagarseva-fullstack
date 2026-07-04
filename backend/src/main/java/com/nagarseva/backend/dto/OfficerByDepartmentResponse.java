package com.nagarseva.backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class OfficerByDepartmentResponse {
    private Boolean success;
    private String message;
    private List<OfficerByDepartmentData> officers;
}
