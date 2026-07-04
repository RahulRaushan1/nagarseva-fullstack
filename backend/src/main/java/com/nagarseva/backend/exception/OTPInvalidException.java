package com.nagarseva.backend.exception;

public class OTPInvalidException extends RuntimeException {
    public OTPInvalidException(String message) {
        super(message);
    }
}
