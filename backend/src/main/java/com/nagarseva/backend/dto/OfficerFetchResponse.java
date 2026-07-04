package com.nagarseva.backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class OfficerFetchResponse {
    private Boolean success;
    private String message;
    private Integer page;
    private Integer size;
    private Long totalElements;
    private Boolean isLast;
    private List<OfficerFetchDataResponse> officers;
}
