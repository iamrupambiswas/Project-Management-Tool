package com.biswas.project_management_backend.repository;

import com.biswas.project_management_backend.model.Team;
import com.biswas.project_management_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeamRepository extends JpaRepository<Team, Long> {

    Optional<Team> findByName(String name);
    List<Team> findByCompanyId(Long companyId);
    boolean existsByName(String name);
    Long countByCompanyId(Long companyId);
    Long countByMembersContaining(User user);

}
