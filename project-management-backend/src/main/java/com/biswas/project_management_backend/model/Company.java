package com.biswas.project_management_backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String domain;

    @Column(nullable = false, unique = true)
    private String joinCode;

    @PrePersist
    public void generateJoinCode() {
        if (joinCode == null || joinCode.isEmpty()) {
            joinCode = UUID.randomUUID().toString().substring(0, 8);
        }
    }
}
