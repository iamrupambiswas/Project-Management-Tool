package com.biswas.project_management_backend.dto.mapper;

import com.biswas.project_management_backend.dto.TeamDto;
import com.biswas.project_management_backend.model.Company;
import com.biswas.project_management_backend.model.Team;
import com.biswas.project_management_backend.model.User;
import com.biswas.project_management_backend.repository.CompanyRepository;
import com.biswas.project_management_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

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

    public TeamDto toDto(Team team) {
        if (team == null) return null;

        List<String> memberEmails = Collections.emptyList();

        if (team.getMembers() != null) {
            memberEmails = team.getMembers().stream()
                    .map(User::getEmail)
                    .toList();
        }

        // Using Lombok's @Builder for cleaner DTO creation
        return TeamDto.builder()
                .id(team.getId())
                .name(team.getName())
                .description(team.getDescription())
                .memberEmails(memberEmails)
                .companyId(team.getCompany().getId())
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
