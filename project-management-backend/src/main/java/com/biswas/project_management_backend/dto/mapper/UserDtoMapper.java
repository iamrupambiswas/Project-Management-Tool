package com.biswas.project_management_backend.dto.mapper;

import com.biswas.project_management_backend.dto.UserDto;
import com.biswas.project_management_backend.model.User;
import com.biswas.project_management_backend.model.Role;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class UserDtoMapper {

    public UserDto toDto(User user) {
        if (user == null) return null;

        // Using Lombok's @Builder for cleaner DTO creation
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(user.getRoles()
                        .stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet()))
                .build();
    }

    public User toEntity(UserDto dto) {
        if (dto == null) return null;

        User entity = new User();

        if (dto.getId() != null) {
            entity.setId(dto.getId());
        }

        entity.setUsername(dto.getUsername());
        entity.setEmail(dto.getEmail());

        // NOTE: we can’t fully map roles here because Role entities
        // should be fetched from DB (use RoleRepository in service layer)
        // so we skip setting roles here
        entity.setRoles(Set.of());

        return entity;
    }
}
