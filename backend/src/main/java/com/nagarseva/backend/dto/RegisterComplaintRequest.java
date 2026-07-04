package com.nagarseva.backend.dto;

import com.nagarseva.backend.enums.IssueType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
public class RegisterComplaintRequest {

    @NotBlank(message = "Title cannot be empty and must be between 2–10 characters.")
    @Size(min = 2, max = 50)
    private String title;

    @NotNull(message = "Issue type is required. Please Select from Available options")
    private IssueType issueType;

    @NotBlank(message = "Description cannot be empty and must be between 10–30 characters.")
    @Size(min = 10, max=200)
    private String desc;

    private Integer wardId;

    private List<MultipartFile> images;

    private Double latitude;
    private Double longitude;
    private String landmark;
}
