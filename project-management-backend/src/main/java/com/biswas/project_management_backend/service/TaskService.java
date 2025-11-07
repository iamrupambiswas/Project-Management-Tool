package com.biswas.project_management_backend.service;

import com.biswas.project_management_backend.dto.ProjectDto;
import com.biswas.project_management_backend.dto.TaskDto;
import com.biswas.project_management_backend.dto.mapper.ProjectDtoMapper;
import com.biswas.project_management_backend.dto.mapper.TaskDtoMapper;
import com.biswas.project_management_backend.model.Company;
import com.biswas.project_management_backend.model.Project;
import com.biswas.project_management_backend.model.Task;
import com.biswas.project_management_backend.model.User;
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
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskDtoMapper dtoMapper;

    @Autowired
    ProjectRepository projectRepository;

    @Autowired
    ProjectDtoMapper projectDtoMapper;

    @Autowired
    UserRepository userRepository;

    @Autowired
    CompanyRepository companyRepository;

    @Autowired
    NotificationService notificationService;

    public TaskDto createTask(TaskDto dto) {
        Task task = dtoMapper.toEntity(dto);
        Project project = projectRepository.getById(dto.getProject().getId());
        User creator = userRepository.getById(dto.getCreatorId());
        Company company = companyRepository.getById(dto.getCompanyId());

        task.setProject(project);
        task.setCreator(creator);
        task.setCompany(company);

        // Save task first (required before assigning)
        Task saved = taskRepository.save(task);

        // Assign task only if assigneeId is present
        if (dto.getAssigneeId() != null) {
            assignTask(saved.getId(), dto.getAssigneeId());
        }

        return dtoMapper.toDto(saved);
    }

    public String assignTask(Long taskId, Long assigneeId) {
        Task task = taskRepository.getById(taskId);
        User assignee = userRepository.getById(assigneeId);

        task.setAssignee(assignee);
        taskRepository.save(task);

        notificationService.createNotification(
                assignee,
                "You’ve been assigned a new task: " + task.getTitle(),
                NotificationType.TASK_ASSIGNED,
                task.getId()
        );

        return "Task '" + task.getTitle() + "' has been assigned to " + assignee.getUsername();
    }

    public TaskDto updateTask(Long id, TaskDto dto) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with id " + id));

        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setStatus(dto.getStatus());
        task.setPriority(dto.getPriority());
        task.setDueDate(dto.getDueDate());

        Task updated = taskRepository.save(task);
        return dtoMapper.toDto(updated);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    public TaskDto getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with id " + id));
        return dtoMapper.toDto(task);
    }

    public List<TaskDto> getAllTasks(Long companyId) {
        List<Task> tasks = taskRepository.findByCompanyId(companyId);
        List<TaskDto> dtos = new ArrayList<>();
        for (Task t : tasks) {
            dtos.add(dtoMapper.toDto(t));
        }
        return dtos;
    }

    public List<TaskDto> getTasksByProject(Long projectId) {
        Project project = projectRepository.getById(projectId);
        List<Task> tasks = taskRepository.findByProject(project);
        List<TaskDto> dtos = new ArrayList<>();
        for (Task t : tasks) {
            dtos.add(dtoMapper.toDto(t));
        }
        return dtos;
    }

    public List<TaskDto> getTasksByAssignee(User assignee) {
        List<Task> tasks = taskRepository.findByAssignee(assignee);
        List<TaskDto> dtos = new ArrayList<>();
        for (Task t : tasks) {
            dtos.add(dtoMapper.toDto(t));
        }
        return dtos;
    }

    public List<TaskDto> getOverdueTasks(Project project) {
        List<Task> tasks = taskRepository.findByProjectAndDueDateBefore(project, LocalDate.now());
        List<TaskDto> dtos = new ArrayList<>();
        for (Task t : tasks) {
            dtos.add(dtoMapper.toDto(t));
        }
        return dtos;
    }
}
