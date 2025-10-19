package com.biswas.project_management_backend.dto;

import com.biswas.project_management_backend.model.enm.ProjectStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDto {
    private Long id;
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private ProjectStatus status;

    private Long createdById;

    private TeamDto team;

    private Integer memberCount;

    private List<UserDto> members;

    private Long taskCount;
}
