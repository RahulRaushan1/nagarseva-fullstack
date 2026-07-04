package com.nagarseva.backend.exception;

public class MissingWardException extends RuntimeException {
    public MissingWardException(String message) {
        super(message);
    }
}
