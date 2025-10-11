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

    // Uses the simplified DTO for the user who created the project
    private UserDto createdBy;

    // Uses the simplified DTO for the associated team
    private TeamDto team;

    // Projects will include a count and a list of members for easy display
    private Integer memberCount;

    // List of simplified DTOs for members (useful for showing a small subset in a table/list)
    private List<UserDto> members;

    // We can also include the count of tasks related to this project
    private Long taskCount;
}
