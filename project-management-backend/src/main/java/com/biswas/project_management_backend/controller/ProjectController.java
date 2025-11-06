package com.biswas.project_management_backend.controller;

import com.biswas.project_management_backend.dto.ProjectDto;
import com.biswas.project_management_backend.model.enm.ProjectStatus;
import com.biswas.project_management_backend.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

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

    @PutMapping("/{id}/status")
    public ResponseEntity<ProjectDto> updateProjectStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String status = request.get("status");
        ProjectDto updated = projectService.updateProjectStatus(id, ProjectStatus.valueOf(status));
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
