package com.nagarseva.backend.exception;

public class OTPNotGeneratedException extends RuntimeException {
    public OTPNotGeneratedException(String message) {
        super(message);
    }
}
