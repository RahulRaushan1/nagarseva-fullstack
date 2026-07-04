package com.nagarseva.backend.dto;

import com.nagarseva.backend.enums.Status;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StatusCountDTO {
    private Status status;
    private Long count;

    public StatusCountDTO(Status status, Long count) {
        this.status = status;
        this.count = count;
    }
}
