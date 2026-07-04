package com.nagarseva.backend.exception;

public class ComplaintCreationFailedException extends RuntimeException {
    public ComplaintCreationFailedException(String message) {
        super(message);
    }
}
