package com.nagarseva.backend.dto;

import com.nagarseva.backend.enums.Status;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class RecentComplaintDTO {
    private Integer id;
    private String title;
    private Status status;
    private LocalDateTime createdAt;
}
