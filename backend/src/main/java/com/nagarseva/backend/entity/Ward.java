package com.nagarseva.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Ward {
    @Id
    private Integer id;

    @Column(unique = true, nullable = false)
    private String wardName;

    @OneToOne
    @JoinColumn(name = "councillor_id", unique = true)
    private User councillor;

    @OneToMany(mappedBy = "ward")
    private List<Complaint> complaints;

    @OneToMany(mappedBy = "citizensWard")
    private List<User> citizens;
}
