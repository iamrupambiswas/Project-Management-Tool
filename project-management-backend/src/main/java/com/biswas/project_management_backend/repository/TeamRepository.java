package com.biswas.project_management_backend.repository;

import com.biswas.project_management_backend.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeamRepository extends JpaRepository<Team, Long> {
    Optional<Team> findByName(String name);
    boolean existsByName(String name);
}
