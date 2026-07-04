package com.nagarseva.backend.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Getter
@Setter
public class CouncillorFetchResponse {
    private Boolean success;
    private String message;
    private List<CouncillorFetchData> councillorList;
}
