package com.nagarseva.backend.service;

import com.nagarseva.backend.enums.Status;
import com.nagarseva.backend.exception.InvalidFlowTransitionException;
import com.nagarseva.backend.exception.UnsupportedStatusException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class FlowTransitionValidationService {

    private final Map<Status, List<Status>> allowedTransitions =
            Map.of(
                    Status.CREATED, List.of(Status.APPROVED, Status.REJECTED),
                    Status.APPROVED, List.of(Status.ASSIGNED),
                    Status.ASSIGNED, List.of(Status.IN_PROGRESS),
                    Status.IN_PROGRESS, List.of(Status.PENDING_VERIFICATION),
                    Status.PENDING_VERIFICATION, List.of(Status.CLOSED, Status.AUTO_CLOSED, Status.REOPENED),
                    Status.REOPENED, List.of(Status.IN_PROGRESS)
            );

    public void validateTransition(Status currentStatus, Status nextStatus) {

        if (!allowedTransitions.containsKey(currentStatus))
            throw new UnsupportedStatusException("no further transitions allowed");

        List<Status> nextValidStatus = allowedTransitions.get(currentStatus);

        if (!nextValidStatus.contains(nextStatus)) {
            throw new InvalidFlowTransitionException("Next status is invalid");
        }
    }
}
