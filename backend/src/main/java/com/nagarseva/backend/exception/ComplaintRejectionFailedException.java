package com.nagarseva.backend.exception;

public class ComplaintRejectionFailedException extends RuntimeException {
    public ComplaintRejectionFailedException(String message) {
        super(message);
    }
}
