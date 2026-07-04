package com.nagarseva.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ComplaintPageResponse {
    private Boolean success;
    private String message;
    private Integer page;
    private Integer size;
    private Long totalElements;
    private Boolean isLast;
    private List<ComplaintRecordResponse> complaints;
}
