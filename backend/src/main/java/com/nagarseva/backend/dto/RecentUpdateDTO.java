package com.nagarseva.backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class RecentUpdateDTO {
    private Integer id;
    private String message;
    private LocalDateTime updatedAt;
}
