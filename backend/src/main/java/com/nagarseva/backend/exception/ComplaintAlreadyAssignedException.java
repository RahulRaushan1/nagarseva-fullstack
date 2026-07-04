package com.nagarseva.backend.exception;

public class ComplaintAlreadyAssignedException extends RuntimeException {
    public ComplaintAlreadyAssignedException(String message) {
        super(message);
    }
}
