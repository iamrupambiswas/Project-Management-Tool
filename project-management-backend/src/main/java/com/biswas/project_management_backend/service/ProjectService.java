package com.biswas.project_management_backend.service;

import com.biswas.project_management_backend.dto.ProjectDto;
import com.biswas.project_management_backend.dto.TeamDto;
import com.biswas.project_management_backend.dto.UserDto;
import com.biswas.project_management_backend.dto.mapper.ProjectDtoMapper;
import com.biswas.project_management_backend.dto.mapper.UserDtoMapper;
import com.biswas.project_management_backend.model.Project;
import com.biswas.project_management_backend.model.Team;
import com.biswas.project_management_backend.model.User;
import com.biswas.project_management_backend.model.enm.NotificationType;
import com.biswas.project_management_backend.model.enm.ProjectStatus;
import com.biswas.project_management_backend.repository.ProjectRepository;
import com.biswas.project_management_backend.repository.TeamRepository;
import com.biswas.project_management_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public interface ProjectService {

    List<Project> getProjectsByTeamId(Long teamId);
    ProjectDto createProject(ProjectDto projectDto);
    void sendNotifications(Set<User> recipients, Project project);
    List<ProjectDto> getAllProjects(@PathVariable Long companyId);
    ProjectDto getProjectById(Long projectId);
    ProjectDto updateProject(ProjectDto projectDto);
    ProjectDto updateProjectStatus(Long projectId, ProjectStatus status);
    void deleteProject(Long projectId);

}
