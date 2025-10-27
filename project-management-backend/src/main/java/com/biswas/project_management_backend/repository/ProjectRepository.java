package com.biswas.project_management_backend.repository;

import com.biswas.project_management_backend.model.Project;
import com.biswas.project_management_backend.model.User;
import com.biswas.project_management_backend.model.enm.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByTeamId(Long teamId);
    List<Project> findByMembersId(Long userId);
    List<Project> findByCompanyId(Long companyId);
    Long countByCompanyId(Long companyId);
    Long countByStatusAndCompanyId(ProjectStatus status, Long companyId);
    Long countByMembersContaining(User user);
    Long countByMembersContainingAndStatus(User user, ProjectStatus projectStatus);

}
