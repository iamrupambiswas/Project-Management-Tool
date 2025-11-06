package com.biswas.project_management_backend.service.impl;

import com.biswas.project_management_backend.dto.AdminAnalyticsDto;
import com.biswas.project_management_backend.dto.UserAnalyticsDto;
import com.biswas.project_management_backend.model.User;
import com.biswas.project_management_backend.model.enm.ProjectStatus;
import com.biswas.project_management_backend.model.enm.TaskStatus;
import com.biswas.project_management_backend.repository.ProjectRepository;
import com.biswas.project_management_backend.repository.TaskRepository;
import com.biswas.project_management_backend.repository.TeamRepository;
import com.biswas.project_management_backend.repository.UserRepository;
import com.biswas.project_management_backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;

    @Override
    public AdminAnalyticsDto getAnalyticsSummary(Long companyId, String dateFrom, String dateTo) {
        LocalDate from = dateFrom != null ? LocalDate.parse(dateFrom) : null;
        LocalDate to = dateTo != null ? LocalDate.parse(dateTo) : LocalDate.now();
        AdminAnalyticsDto dto = new AdminAnalyticsDto();
        dto.setTotalUsers(userRepository.countByCompanyId(companyId));
        dto.setTotalProjects(projectRepository.countByCompanyId(companyId));
        dto.setTotalTeams(teamRepository.countByCompanyId(companyId));
        dto.setTotalTasks(taskRepository.countByCompanyId(companyId));
        Map<TaskStatus, Long> tasksByStatus = new EnumMap<>(TaskStatus.class);
        for (TaskStatus status : TaskStatus.values()) {
            tasksByStatus.put(status, taskRepository.countByStatusAndCompanyId(status, companyId));
        }
        dto.setTasksByStatus(tasksByStatus);
        Map<ProjectStatus, Long> projectsByStatus = new EnumMap<>(ProjectStatus.class);
        for (ProjectStatus status : ProjectStatus.values()) {
            projectsByStatus.put(status, projectRepository.countByStatusAndCompanyId(status, companyId));
        }
        dto.setProjectsByStatus(projectsByStatus);
        dto.setOverdueTasks(taskRepository.countByDueDateBeforeAndStatusNotAndCompanyId(LocalDate.now(), TaskStatus.DONE, companyId));
        dto.setActiveUsersLastWeek(userRepository.countActiveUsersLastWeek(companyId, to.minusDays(7)));
        return dto;
    }

    @Override
    public UserAnalyticsDto getUserAnalytics(String userEmail, Long companyId) {
        User user = userRepository.findByEmailAndCompanyId(userEmail, companyId);
//                .orElseThrow(() -> new RuntimeException("User not found"));

        Long assignedTasks = taskRepository.countByAssignee(user);
        Long completedTasks = taskRepository.countByAssigneeAndStatus(user, TaskStatus.DONE);
        Long overdueTasks = taskRepository.countOverdueTasksByAssignee(user.getId());

        List<Object[]> results = taskRepository.countTasksByStatusForUser(user.getId());
        Map<TaskStatus, Long> userTasksByStatus = results.stream()
                .collect(Collectors.toMap(
                        row -> (TaskStatus) row[0],
                        row -> (Long) row[1]
                ));

        Long totalProjects = projectRepository.countByMembersContaining(user);
        Long activeProjects = projectRepository.countByMembersContainingAndStatus(user, ProjectStatus.ACTIVE);
        Long completedProjects = projectRepository.countByMembersContainingAndStatus(user, ProjectStatus.COMPLETED);
        Long totalTeams = teamRepository.countByMembersContaining(user);

        return new UserAnalyticsDto(
                assignedTasks,
                completedTasks,
                overdueTasks,
                userTasksByStatus,
                totalProjects,
                activeProjects,
                completedProjects,
                totalTeams
        );
    }
}
