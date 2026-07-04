package com.nagarseva.backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Setter
@Getter
public class WardFetchResponse {
    private Boolean success;
    private String message;
    private List<WardResponseData> wards;
}
