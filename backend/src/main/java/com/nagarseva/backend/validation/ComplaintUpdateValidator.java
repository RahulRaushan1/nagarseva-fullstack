package com.nagarseva.backend.validation;

import com.nagarseva.backend.dto.UpdateComplaintRequest;
import com.nagarseva.backend.exception.NoFieldProvidedException;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Component
public class ComplaintUpdateValidator {
    public void validate(UpdateComplaintRequest updateComplaintRequest, List<MultipartFile> multipartFile) {
        if (
                (updateComplaintRequest.getTitle() == null || updateComplaintRequest.getTitle().isBlank())
                        && (updateComplaintRequest.getDesc() == null || updateComplaintRequest.getDesc().isBlank())
                        && (updateComplaintRequest.getIssueType() == null)
                        && (updateComplaintRequest.getWardId() == null)
                        && (updateComplaintRequest.getImagePublicIds() == null
                                || updateComplaintRequest.getImagePublicIds().stream().allMatch(x -> x==null || x.isBlank())
                            )
                        && (multipartFile == null
                            || multipartFile.isEmpty()
                            || multipartFile.stream().allMatch(MultipartFile::isEmpty))
        ) {
            throw new NoFieldProvidedException("Validation failed: At least one field must be provided, but none were given.");
        }
    }
}
