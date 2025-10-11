package com.biswas.project_management_backend.model;

import com.biswas.project_management_backend.model.enm.TaskPriority;
import com.biswas.project_management_backend.model.enm.TaskStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * The Task entity, representing a single work item within a project.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status = TaskStatus.TO_DO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskPriority priority = TaskPriority.MEDIUM;

    // --- Relationships ---

    // The project this task belongs to (Many Tasks to One Project)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Project project;

    // The user assigned to this task (Many Tasks to One User)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_user_id") // Nullable if task is unassigned
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User assignee;

    // Optional: The user who created the task
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_user_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User creator;
}
