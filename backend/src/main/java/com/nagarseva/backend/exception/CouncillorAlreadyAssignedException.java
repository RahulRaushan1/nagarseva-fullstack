package com.nagarseva.backend.exception;

public class CouncillorAlreadyAssignedException extends RuntimeException {
    public CouncillorAlreadyAssignedException(String message) {
        super(message);
    }
}
