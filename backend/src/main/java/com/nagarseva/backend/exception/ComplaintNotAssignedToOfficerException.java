package com.nagarseva.backend.exception;

public class ComplaintNotAssignedToOfficerException extends RuntimeException {
    public ComplaintNotAssignedToOfficerException(String message) {
        super(message);
    }
}
