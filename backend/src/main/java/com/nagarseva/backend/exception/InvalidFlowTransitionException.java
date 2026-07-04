package com.nagarseva.backend.exception;

public class InvalidFlowTransitionException extends RuntimeException {
    public InvalidFlowTransitionException(String message) {
        super(message);
    }
}
