package com.biswas.project_management_backend.repository;

import com.biswas.project_management_backend.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByJoinCode(String joinCode);
    boolean existsByJoinCode(String joinCode);
}
