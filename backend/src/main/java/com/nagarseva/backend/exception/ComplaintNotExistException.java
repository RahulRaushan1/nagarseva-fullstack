package com.nagarseva.backend.exception;

public class ComplaintNotExistException extends RuntimeException {
    public ComplaintNotExistException(String message) {
        super(message);
    }
}
