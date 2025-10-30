package com.biswas.project_management_backend.dto.mapper;

import com.biswas.project_management_backend.dto.TaskDto;
import com.biswas.project_management_backend.model.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TaskDtoMapper {

    @Autowired
    ProjectDtoMapper projectDtoMapper;

    // Convert Task entity to DTO
    public TaskDto toDto(Task task) {
        if (task == null) return null;

        return TaskDto.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .createdAt(task.getCreatedAt())
                .dueDate(task.getDueDate())
                .status(task.getStatus())
                .priority(task.getPriority())
                .project(projectDtoMapper.toDto(task.getProject()))
                .assigneeId(task.getAssignee() != null ? task.getAssignee().getId() : null)
                .creatorId(task.getCreator() != null ? task.getCreator().getId() : null)
                .companyId(task.getCompany() != null ? task.getCompany().getId() : null)
                .build();
    }

    // Convert DTO back to Task entity
    public Task toEntity(TaskDto dto) {
        if (dto == null) return null;

        Task task = new Task();
        task.setId(dto.getId());
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setCreatedAt(dto.getCreatedAt());
        task.setDueDate(dto.getDueDate());
        task.setStatus(dto.getStatus());
        task.setPriority(dto.getPriority());
        // Note: Project, Assignee, Creator, and Company must be set separately in the service if needed
        return task;
    }
}
