package com.nagarseva.backend.exception;

public class OTPRequestTooFrequentException extends RuntimeException {
    public OTPRequestTooFrequentException(String message) {
        super(message);
    }
}
