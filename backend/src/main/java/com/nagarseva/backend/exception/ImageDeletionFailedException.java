package com.nagarseva.backend.exception;

public class ImageDeletionFailedException extends RuntimeException {
    public ImageDeletionFailedException(String message) {
        super(message);
    }
}
