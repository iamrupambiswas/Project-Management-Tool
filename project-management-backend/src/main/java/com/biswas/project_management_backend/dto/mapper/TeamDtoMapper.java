package com.biswas.project_management_backend.dto.mapper;

import com.biswas.project_management_backend.dto.TeamDto;
import com.biswas.project_management_backend.dto.UserDto;
import com.biswas.project_management_backend.model.Company;
import com.biswas.project_management_backend.model.Team;
import com.biswas.project_management_backend.model.User;
import com.biswas.project_management_backend.repository.CompanyRepository;
import com.biswas.project_management_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class TeamDtoMapper {

    @Autowired
    CompanyRepository companyRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserDtoMapper userDtoMapper;

    public TeamDto toDto(Team team) {
        if (team == null) return null;

        // Handle null-safe member email mapping
        List<String> memberEmails = team.getMembers() != null
                ? team.getMembers().stream()
                .map(User::getEmail)
                .toList()
                : Collections.emptyList();

        // Create a mutable list for UserDto mapping
        List<UserDto> members = new ArrayList<>();

        if (team.getMembers() != null) {
            for (User user : team.getMembers()) {
                UserDto userDto = userDtoMapper.toDto(user);
                members.add(userDto);
            }
        }

        // Build the DTO using Lombok's builder
        return TeamDto.builder()
                .id(team.getId())
                .name(team.getName())
                .description(team.getDescription())
                .memberEmails(memberEmails)
                .members(members)
                .companyId(
                        team.getCompany() != null
                                ? team.getCompany().getId()
                                : null
                )
                .build();
    }

    public Team toEntity(TeamDto dto) {
        if (dto == null) return null;

        Team entity = new Team();

        if (dto.getId() != null) {
            entity.setId(dto.getId());
        }
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());

        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + dto.getCompanyId()));
        entity.setCompany(company);

        if (dto.getMemberEmails() != null && !dto.getMemberEmails().isEmpty()) {
            Set<User> members = dto.getMemberEmails().stream()
                    .map(email -> userRepository.findByEmail(email)
                            .orElseThrow(() -> new RuntimeException("User not found: " + email)))
                    .collect(Collectors.toSet());
            entity.setMembers(members);
        }

        return entity;
    }
}
