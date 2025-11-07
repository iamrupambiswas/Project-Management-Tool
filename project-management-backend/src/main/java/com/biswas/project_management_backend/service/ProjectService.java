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

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepo;

    @Autowired
    private ProjectDtoMapper dtoMapper;

    @Autowired
    UserRepository userRepo;

    @Autowired
    UserDtoMapper userDtoMapper;

    @Autowired
    TeamRepository teamRepository;

    @Autowired
    NotificationService notificationService;

    public List<Project> getProjectsByTeamId(Long teamId){
        return projectRepo.findByTeamId(teamId);
    }

    public ProjectDto createProject(ProjectDto projectDto) {
        if (projectDto.getTeam() == null || projectDto.getTeam().getId() == null) {
            throw new RuntimeException("Project must have a valid team assigned");
        }

        Team team = teamRepository.getById(projectDto.getTeam().getId());
        Set<User> teamMembers = team.getMembers();

        List<UserDto> projectMembers = new ArrayList<>();
        if (teamMembers != null) {
            for (User user : teamMembers) {
                UserDto userDto = userDtoMapper.toDto(user);
                projectMembers.add(userDto);
            }
        }

        projectDto.setMembers(projectMembers);
        projectDto.setMemberCount(projectMembers.size());

        Project project = dtoMapper.toEntity(projectDto);
        Project savedProject = projectRepo.save(project);

        sendNotifications(savedProject.getMembers(), savedProject);

        return dtoMapper.toDto(savedProject);
    }

    public void sendNotifications(Set<User> recipients, Project project) {

        if (recipients != null) {
            for (User recipient: recipients) {
                notificationService.createNotification(
                        recipient,
                        "Your team has been assigned a new project: " + project.getName(),
                        NotificationType.PROJECT_ASSIGNED,
                        project.getId()
                );
            }
        }

    }



    public List<ProjectDto> getAllProjects(Long companyId) {
        List<Project> projects = projectRepo.findByCompanyId(companyId);
        return projects.stream()
                .map(dtoMapper::toDto)
                .collect(Collectors.toList());
    }

    public ProjectDto getProjectById(Long projectId) {
        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        return dtoMapper.toDto(project);
    }

    public ProjectDto updateProject(ProjectDto projectDto) {
        Project project = dtoMapper.toEntity(projectDto);
        Project updatedProject = projectRepo.save(project);
        return dtoMapper.toDto(updatedProject);
    }

    public ProjectDto updateProjectStatus(Long projectId, ProjectStatus status) {
        Project project = projectRepo.getById(projectId);
        project.setStatus(status);
        projectRepo.save(project);

        ProjectDto projectDto = dtoMapper.toDto(project);

        return projectDto;
    }

    public void deleteProject(Long projectId) {
        projectRepo.deleteById(projectId);
    }


}
