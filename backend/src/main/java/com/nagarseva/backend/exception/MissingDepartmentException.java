package com.nagarseva.backend.exception;

public class MissingDepartmentException extends RuntimeException {
    public MissingDepartmentException(String message) {
        super(message);
    }
}
