package com.nagarseva.backend.entity;

import com.nagarseva.backend.enums.Department;
import com.nagarseva.backend.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String email;
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String fullName;

    @Enumerated(EnumType.STRING)
    private Role role;

    private boolean active;
    private boolean isDefaultPassword;

    @Enumerated(EnumType.STRING)
    private Department department;

    private Boolean notificationEnabled;

    private String resetOtp;
    private LocalDateTime resetOtpExpiry;
    private LocalDateTime resetOtpVerifiedUntil;

    @OneToMany(mappedBy = "createdBy")
    private List<Complaint> createdComplaints;

    @OneToMany(mappedBy = "assignedTo")
    private List<Complaint> assignedComplaints;

    @ManyToOne
    @JoinColumn(name = "ward_id")
    private Ward citizensWard;

    @OneToOne(mappedBy = "councillor")
    private Ward councillorWard;

    @OneToMany(mappedBy = "solvedByOfficer")
    private List<ComplaintStatusHistory> complaintHandledByOfficer;

}
