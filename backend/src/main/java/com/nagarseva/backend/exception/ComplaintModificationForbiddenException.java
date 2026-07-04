package com.nagarseva.backend.exception;

public class ComplaintModificationForbiddenException extends RuntimeException {
    public ComplaintModificationForbiddenException(String message) {
        super(message);
    }
}
