package com.biswas.project_management_backend.dto;

import com.biswas.project_management_backend.model.enm.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserAnalyticsDto {
    private Long assignedTasks;
    private Long completedTasks;
    private Long overdueTasks;
    private Map<TaskStatus, Long> userTasksByStatus;
    private Long totalProjects;
    private Long activeProjects;
    private Long completedProjects;
    private Long totalTeams;
}
