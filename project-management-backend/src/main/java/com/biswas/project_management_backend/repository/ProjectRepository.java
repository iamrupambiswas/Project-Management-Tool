package com.biswas.project_management_backend.repository;

import com.biswas.project_management_backend.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByTeamId(Long teamId);
    List<Project> findByMembersId(Long userId);
    List<Project> findByCompanyId(Long companyId);

}
