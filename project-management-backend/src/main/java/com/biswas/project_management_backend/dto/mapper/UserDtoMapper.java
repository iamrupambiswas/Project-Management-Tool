package com.biswas.project_management_backend.dto.mapper;

import com.biswas.project_management_backend.dto.UserDto;
import com.biswas.project_management_backend.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserDtoMapper {

    public UserDto toDto(User user) {
        if (user == null) return null;

        // Using Lombok's @Builder for cleaner DTO creation
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                // Maps the Set<String> roles directly
                .role(user.getRole())
                .build();
    }

    public User toEntity(UserDto dto) {
        if (dto == null) return null;

        User entity = new User();

        // Only map ID if present (used for identification in update scenarios)
        if (dto.getId() != null) {
            entity.setId(dto.getId());
        }

        // Map mutable fields
        entity.setUsername(dto.getUsername());
        entity.setEmail(dto.getEmail());
        entity.setRole(dto.getRole());

        return entity;
    }
}
