package com.nagarseva.backend.exception;

public class EmptyFileUploadException extends RuntimeException {
    public EmptyFileUploadException(String message) {
        super(message);
    }
}
