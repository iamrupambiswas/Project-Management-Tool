package com.biswas.project_management_backend.controller;

import com.biswas.project_management_backend.dto.ProjectDto;
import com.biswas.project_management_backend.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    @Autowired
    private final ProjectService projectService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProjectDto> createProject(@RequestBody ProjectDto projectDto) {
        ProjectDto createdProject = projectService.createProject(projectDto);
        return ResponseEntity.ok(createdProject);
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<ProjectDto>> getAllProjects(@PathVariable Long companyId) {
        List<ProjectDto> projects = projectService.getAllProjects(companyId);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDto> getProjectById(@PathVariable Long id) {
        ProjectDto project = projectService.getProjectById(id);
        return ResponseEntity.ok(project);
    }

    @PutMapping
    public ResponseEntity<ProjectDto> updateProject(@RequestBody ProjectDto projectDto) {
        ProjectDto updatedProject = projectService.updateProject(projectDto);
        return ResponseEntity.ok(updatedProject);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
