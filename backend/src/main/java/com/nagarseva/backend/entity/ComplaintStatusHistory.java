package com.nagarseva.backend.entity;

import com.nagarseva.backend.enums.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintStatusHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "complaint_id")
    private Complaint complaint;

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDateTime changedAt;

    private String remark;
    private String contactDetails;

    @ManyToOne
    @JoinColumn(name = "officer_id")
    private User solvedByOfficer;

    private Integer cycleNumber;

}
