package com.nagarseva.backend.exception;

public class WardAlreadyAssignedToDifferentCouncillorException extends RuntimeException {
    public WardAlreadyAssignedToDifferentCouncillorException(String message) {
        super(message);
    }
}
