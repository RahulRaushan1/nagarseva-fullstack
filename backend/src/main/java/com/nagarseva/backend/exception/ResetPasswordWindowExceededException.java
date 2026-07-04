package com.nagarseva.backend.exception;

public class ResetPasswordWindowExceededException extends RuntimeException {
    public ResetPasswordWindowExceededException(String message) {
        super(message);
    }
}
