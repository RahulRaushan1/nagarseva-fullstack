package com.nagarseva.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.nagarseva.backend.enums.ImageType;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ImageResponse {
    private String publicId;
    public String url;
    public ImageType imageType;
}
