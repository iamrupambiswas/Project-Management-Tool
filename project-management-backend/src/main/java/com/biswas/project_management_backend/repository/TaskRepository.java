package com.biswas.project_management_backend.repository;

import com.biswas.project_management_backend.model.Task;
import com.biswas.project_management_backend.model.User;
import com.biswas.project_management_backend.model.Project;
import com.biswas.project_management_backend.model.enm.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProject(Project project);
    List<Task> findByCompanyId(Long companyId);
    List<Task> findByAssignee(User assignee);
    List<Task> findByProjectAndDueDateBefore(Project project, LocalDate date);
    Long countByCompanyId(Long companyId);
    Long countByStatusAndCompanyId(TaskStatus status, Long companyId);
    Long countByDueDateBeforeAndStatusNotAndCompanyId(LocalDate date, TaskStatus status, Long companyId);
    Long countByAssignee(User user);
    Long countByAssigneeAndStatus(User user, TaskStatus taskStatus);

    @Query("""
        SELECT COUNT(t)
        FROM Task t
        WHERE t.assignee.id = :userId
        AND t.dueDate < CURRENT_DATE
        AND t.status <> com.biswas.project_management_backend.model.enm.TaskStatus.DONE
    """)
    Long countOverdueTasksByAssignee(@Param("userId") Long userId);

    @Query("""
        SELECT t.status, COUNT(t)
        FROM Task t
        WHERE t.assignee.id = :userId
        GROUP BY t.status
    """)
    List<Object[]> countTasksByStatusForUser(@Param("userId") Long userId);
}
