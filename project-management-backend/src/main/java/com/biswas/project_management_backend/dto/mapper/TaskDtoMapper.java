package com.biswas.project_management_backend.dto.mapper;

import com.biswas.project_management_backend.dto.TaskDto;
import com.biswas.project_management_backend.model.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TaskDtoMapper implements DtoMapper<Task, TaskDto> {

    @Autowired
    private ProjectDtoMapper projectDtoMapper;

    @Override
    public TaskDto toDto(Task task) {
        if (task == null) return null;

        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setDueDate(task.getDueDate());
        dto.setStatus(task.getStatus());
        dto.setPriority(task.getPriority());
        dto.setProject(projectDtoMapper.toDto(task.getProject()));
        dto.setAssigneeId(task.getAssignee() != null ? task.getAssignee().getId() : null);
        dto.setCreatorId(task.getCreator() != null ? task.getCreator().getId() : null);
        dto.setCompanyId(task.getCompany() != null ? task.getCompany().getId() : null);
        return dto;
    }

    @Override
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
        return task;
    }
}