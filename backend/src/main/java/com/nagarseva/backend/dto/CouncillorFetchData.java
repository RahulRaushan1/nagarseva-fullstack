package com.nagarseva.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CouncillorFetchData {
    private Integer councillorId;
    private String name;
}
