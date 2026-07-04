package com.nagarseva.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LocationResponse {
    private Double latitude;
    private Double longtitude;
    private String landmark;
}
