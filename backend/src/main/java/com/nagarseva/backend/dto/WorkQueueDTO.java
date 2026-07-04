package com.nagarseva.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WorkQueueDTO {
    private Long highPriorityCount;
    private Long mediumPriorityCount;
    private Long lowPriorityCount;
}
