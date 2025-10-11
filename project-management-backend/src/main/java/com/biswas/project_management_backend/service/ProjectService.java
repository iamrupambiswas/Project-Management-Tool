package com.biswas.project_management_backend.service;

import com.biswas.project_management_backend.dto.ProjectDto;
import com.biswas.project_management_backend.dto.mapper.ProjectDtoMapper;
import com.biswas.project_management_backend.model.Project;
import com.biswas.project_management_backend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepo;

    @Autowired
    private ProjectDtoMapper dtoMapper;

    public List<Project> getProjectsByTeamId(Long teamId){
        return projectRepo.findByTeamId(teamId);
    }

    public ProjectDto createProject(ProjectDto projectDto) {
        Project project = dtoMapper.toEntity(projectDto);
        Project newProject = projectRepo.save(project);
        return dtoMapper.toDto(project);
    }

    public List<ProjectDto> getAllProjects() {
        List<Project> projects = projectRepo.findAll();
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

    public void deleteProject(Long projectId) {
        projectRepo.deleteById(projectId);
    }


}
