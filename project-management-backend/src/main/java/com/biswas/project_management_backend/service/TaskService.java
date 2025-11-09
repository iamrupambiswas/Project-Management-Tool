package com.biswas.project_management_backend.service;

import com.biswas.project_management_backend.dto.TaskDto;
import com.biswas.project_management_backend.model.Project;
import com.biswas.project_management_backend.model.User;
import java.util.List;

public interface TaskService {
    TaskDto createTask(TaskDto dto);
    String assignTask(Long taskId, Long assigneeId);
    TaskDto updateTask(Long id, TaskDto dto);
    void deleteTask(Long id);
    TaskDto getTaskById(Long id);
    List<TaskDto> getAllTasks(Long companyId);
    List<TaskDto> getTasksByProject(Long projectId);
    List<TaskDto> getTasksByAssignee(User assignee);
    List<TaskDto> getOverdueTasks(Project project);
}
