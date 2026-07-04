package com.nagarseva.backend.exception;

public class InsufficentLocationDetailsException extends RuntimeException {
    public InsufficentLocationDetailsException(String message) {
        super(message);
    }
}
