package com.nagarseva.backend.exception;

public class ComplaintSubmissionFailedException extends RuntimeException {
    public ComplaintSubmissionFailedException(String message) {
        super(message);
    }
}
