package com.biswas.project_management_backend.dto.mapper;

import com.biswas.project_management_backend.dto.ProjectDto;
import com.biswas.project_management_backend.model.Project;
import com.biswas.project_management_backend.model.User;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class ProjectDtoMapper {

    private final UserDtoMapper userDtoMapper;
    private final TeamDtoMapper teamDtoMapper;

    // Inject required mappers
    public ProjectDtoMapper(UserDtoMapper userDtoMapper, TeamDtoMapper teamDtoMapper) {
        this.userDtoMapper = userDtoMapper;
        this.teamDtoMapper = teamDtoMapper;
    }

    /**
     * Converts a Project entity to a ProjectDto.
     * This method handles mapping relationships and calculating aggregate fields.
     */
    public ProjectDto toDto(Project project) {
        if (project == null) return null;

        ProjectDto dto = new ProjectDto();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setStartDate(project.getStartDate());
        dto.setEndDate(project.getEndDate());
        dto.setStatus(project.getStatus());

        // 1. Map simple reference relationships using dedicated mappers
        if (project.getCreatedById() != null) {
            dto.setCreatedById(project.getCreatedById());
        }

        if (project.getTeam() != null) {
            dto.setTeam(teamDtoMapper.toDto(project.getTeam()));
        }

        // 2. Map members collection and calculate count
        if (project.getMembers() != null) {
            // Calculate member count
            dto.setMemberCount(project.getMembers().size());

            // Map the first few members for display purposes (e.g., first 5)
            dto.setMembers(project.getMembers().stream()
                    .limit(5) // Limit the list size to keep the payload small
                    .map(userDtoMapper::toDto)
                    .collect(Collectors.toList()));
        } else {
            dto.setMemberCount(0);
        }

        // 3. Calculate task count
        if (project.getTasks() != null) {
            dto.setTaskCount((long) project.getTasks().size());
        } else {
            dto.setTaskCount(0L);
        }

        return dto;
    }

    /**
     * Converts a ProjectDto to a Project entity.
     * NOTE: This is generally used for creating or updating an entity.
     * When converting DTO back to Entity, setting relational fields (like createdBy, team, members)
     * requires database lookups (e.g., finding the User entity by ID) which should typically be
     * handled in the service layer, not the mapper.
     */
    public Project toEntity(ProjectDto dto) {
        if (dto == null) return null;

        Project project = new Project();

        // Map basic fields
        if(dto.getId() != null) {
            project.setId(dto.getId());
        }
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setStartDate(dto.getStartDate());
        project.setEndDate(dto.getEndDate());
        project.setStatus(dto.getStatus());
        project.setCreatedById(dto.getCreatedById());

        // Important: We do NOT map relational objects (createdBy, team, members) here.
        // In a real application, the service layer would receive the DTO, extract the IDs
        // for these relationships (e.g., Team ID), fetch the corresponding entities from the
        // database, and then set them on the 'project' entity before saving.

        // Example: project.setCreatedBy(userService.findUserById(dto.getCreatedBy().getId()));

        return project;
    }
}
