package com.nagarseva.backend.exception;

public class MaxImageUploadExceededException extends RuntimeException {
    public MaxImageUploadExceededException(String message) {
        super(message);
    }
}
