package com.biswas.project_management_backend.repository;

import com.biswas.project_management_backend.model.Task;
import com.biswas.project_management_backend.model.User;
import com.biswas.project_management_backend.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProject(Project project);

    List<Task> findByAssignee(User assignee);

    List<Task> findByStatus(String status);

    List<Task> findByDueDateBefore(LocalDate date);

    List<Task> findByPriority(String priority);

    List<Task> findByProjectAndAssignee(Project project, User assignee);

    List<Task> findByProjectAndDueDateBefore(Project project, LocalDate date);
}
