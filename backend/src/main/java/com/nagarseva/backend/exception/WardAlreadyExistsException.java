package com.nagarseva.backend.exception;

public class WardAlreadyExistsException extends RuntimeException {
    public WardAlreadyExistsException(String message) {
        super(message);
    }
}
