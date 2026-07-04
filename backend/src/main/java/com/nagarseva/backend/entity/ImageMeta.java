package com.nagarseva.backend.entity;

import com.nagarseva.backend.enums.ImageType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "complaint_images")
public class ImageMeta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    private Complaint complaint;

    @Enumerated(EnumType.STRING)
    private ImageType imageType;

    private String imageUrl;
    private String imagePublicId;

    private Integer cycleNumber;
}
