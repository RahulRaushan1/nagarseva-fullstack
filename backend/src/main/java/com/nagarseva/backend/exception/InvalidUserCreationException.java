package com.nagarseva.backend.exception;

public class InvalidUserCreationException extends RuntimeException {
    public InvalidUserCreationException(String message) {
        super(message);
    }
}
