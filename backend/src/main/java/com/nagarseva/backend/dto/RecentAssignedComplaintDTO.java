package com.nagarseva.backend.dto;

import com.nagarseva.backend.enums.Priority;
import com.nagarseva.backend.enums.Status;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class RecentAssignedComplaintDTO {
    private Integer id;
    private String title;
    private Priority priority;
    private Status status;
    private LocalDateTime createdAt;
}
