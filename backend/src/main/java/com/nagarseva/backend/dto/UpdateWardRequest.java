package com.nagarseva.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateWardRequest {
    @NotBlank(message = "WardName can't be empty")
    private String wardName;
}
