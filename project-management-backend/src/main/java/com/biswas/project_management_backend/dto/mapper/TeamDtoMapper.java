package com.biswas.project_management_backend.dto.mapper;

import com.biswas.project_management_backend.dto.TeamDto;
import com.biswas.project_management_backend.model.Team;
import com.biswas.project_management_backend.model.User;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class TeamDtoMapper {

    /**
     * Converts a Team Entity to a TeamDto.
     * Maps the Set<User> members from the entity to a Set<String> (usernames) in the DTO.
     * @param team The Team entity to convert.
     * @return The resulting TeamDto.
     */
    public TeamDto toDto(Team team) {
        if (team == null) return null;

        Set<String> memberUsernames = Collections.emptySet();

        // Convert the Set<User> members from the entity to a Set<String> of usernames for the DTO
        if (team.getMembers() != null) {
            memberUsernames = team.getMembers().stream()
                    .map(User::getUsername) // Assuming the User entity has getUsername()
                    .collect(Collectors.toSet());
        }

        // Using Lombok's @Builder for cleaner DTO creation
        return TeamDto.builder()
                .id(team.getId())
                .name(team.getName())
                .description(team.getDescription())
                .members(memberUsernames)
                .build();
    }

    /**
     * Converts a TeamDto back to a Team Entity.
     * Note: The 'members' Set<String> from the DTO is ignored here, as converting string usernames
     * back to User entities requires database access and belongs in the service layer.
     * @param dto The TeamDto to convert.
     * @return The resulting Team entity.
     */
    public Team toEntity(TeamDto dto) {
        if (dto == null) return null;

        Team entity = new Team();

        if (dto.getId() != null) {
            entity.setId(dto.getId());
        }
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());

        return entity;
    }
}
