package com.biswas.project_management_backend.service;

import com.biswas.project_management_backend.dto.ProjectDto;
import com.biswas.project_management_backend.model.Project;
import com.biswas.project_management_backend.model.User;
import com.biswas.project_management_backend.model.enm.ProjectStatus;

import java.util.List;
import java.util.Set;

public interface ProjectService {

    List<Project> getProjectsByTeamId(Long teamId);

    ProjectDto createProject(ProjectDto projectDto);

    void sendNotifications(Set<User> recipients, Project project);

    List<ProjectDto> getAllProjects(Long companyId);

    ProjectDto getProjectById(Long projectId);

    ProjectDto updateProject(ProjectDto projectDto);

    ProjectDto updateProjectStatus(Long projectId, ProjectStatus status);

    void deleteProject(Long projectId);
}
