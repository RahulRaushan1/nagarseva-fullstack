package com.nagarseva.backend.exception;

public class ImageSizeExceededException extends RuntimeException {
    public ImageSizeExceededException(String message) {
        super(message);
    }
}
