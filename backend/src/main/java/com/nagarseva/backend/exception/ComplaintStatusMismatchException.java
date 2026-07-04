package com.nagarseva.backend.exception;

public class ComplaintStatusMismatchException extends RuntimeException {
    public ComplaintStatusMismatchException(String message) {
        super(message);
    }
}
