package com.biswas.project_management_backend.service;

import com.biswas.project_management_backend.dto.TaskDto;
import com.biswas.project_management_backend.model.Project;
import com.biswas.project_management_backend.model.User;
<<<<<<< HEAD
=======
import com.biswas.project_management_backend.model.enm.NotificationType;
import com.biswas.project_management_backend.repository.CompanyRepository;
import com.biswas.project_management_backend.repository.ProjectRepository;
import com.biswas.project_management_backend.repository.TaskRepository;
import com.biswas.project_management_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
>>>>>>> 70d91563452f25891833f3cf430f48834c5aaf6c
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
