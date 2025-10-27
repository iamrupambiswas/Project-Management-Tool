package com.biswas.project_management_backend.dto;

import com.biswas.project_management_backend.model.enm.ProjectStatus;
import com.biswas.project_management_backend.model.enm.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminAnalyticsDto {
    private Long totalUsers;
    private Long totalProjects;
    private Long totalTeams;
    private Long totalTasks;
    private Map<TaskStatus, Long> tasksByStatus; // e.g., {"TO_DO": 40, "IN_PROGRESS": 30, "REVIEW": 20, "DONE": 10}
    private Map<ProjectStatus, Long> projectsByStatus; // e.g., {"ACTIVE": 15, "ON_HOLD": 3, "COMPLETED": 2}
    private Long overdueTasks;
    private Long activeUsersLastWeek;
}