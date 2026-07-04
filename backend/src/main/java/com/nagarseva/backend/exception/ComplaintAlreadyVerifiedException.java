package com.nagarseva.backend.exception;

public class ComplaintAlreadyVerifiedException extends RuntimeException {
    public ComplaintAlreadyVerifiedException(String message) {
        super(message);
    }
}
