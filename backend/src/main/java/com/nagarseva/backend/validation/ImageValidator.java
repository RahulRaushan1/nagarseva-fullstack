package com.nagarseva.backend.validation;

import com.nagarseva.backend.exception.EmptyFileUploadException;
import com.nagarseva.backend.exception.ImageSizeExceededException;
import com.nagarseva.backend.exception.UnsupportedFileTypeException;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Component
public class ImageValidator {

    public void validate(List<MultipartFile> files) {
        for (MultipartFile file : files) {
            if (file.isEmpty())
                throw new EmptyFileUploadException("No file content provided.");

            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/"))
                throw new UnsupportedFileTypeException("Only images files are allowed");

            long maxSize = 5 * 1024 * 1024;
            if (file.getSize() > maxSize) {
                throw new ImageSizeExceededException("File size should not exceed 5MB");
            }
        }
    }
}
