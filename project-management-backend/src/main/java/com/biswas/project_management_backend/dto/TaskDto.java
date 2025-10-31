package com.biswas.project_management_backend.dto;

import com.biswas.project_management_backend.model.enm.TaskPriority;
import com.biswas.project_management_backend.model.enm.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskDto {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private LocalDate dueDate;
    private TaskStatus status;
    private TaskPriority priority;
    private ProjectDto project;
    private Long assigneeId;     // User assigned to this task
    private Long creatorId;      // User who created the task
    private Long companyId;      // Optional company ID if needed
}
