package com.biswas.project_management_backend.dto.mapper;

import com.biswas.project_management_backend.dto.UserDto;
import com.biswas.project_management_backend.model.Role;
import com.biswas.project_management_backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class UserDtoMapper implements DtoMapper<User, UserDto> {

    @Autowired
    private CompanyDtoMapper companyDtoMapper;

    @Override
    public UserDto toDto(User user) {
        if (user == null) return null;

        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setLastActive(user.getLastActiveDate());
        dto.setCompanyDto(companyDtoMapper.toDto(user.getCompany()));

        Set<String> roleNames = new HashSet<>();
        if (user.getRoles() != null) {
            for (Role role : user.getRoles()) {
                roleNames.add(role.getName());
            }
        }
        dto.setRoles(roleNames);

        if(user.getProfileImage() != null) {
            dto.setProfileImageUrl(user.getProfileImage().getUrl());
        }

        return dto;
    }

    @Override
    public User toEntity(UserDto dto) {
        if (dto == null) return null;

        User user = new User();
        user.setId(dto.getId());
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setRoles(new HashSet<>());
        return user;
    }
}
