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

import java.util.*;

@Component
public class TeamDtoMapper implements DtoMapper<Team, TeamDto> {

    @Autowired
    private UserDtoMapper userDtoMapper;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public TeamDto toDto(Team team) {
        if (team == null) return null;

        TeamDto dto = new TeamDto();
        dto.setId(team.getId());
        dto.setName(team.getName());
        dto.setDescription(team.getDescription());

        List<String> memberEmails = new ArrayList<>();
        List<UserDto> members = new ArrayList<>();

        if (team.getMembers() != null) {
            for (User user : team.getMembers()) {
                memberEmails.add(user.getEmail());
                members.add(userDtoMapper.toDto(user));
            }
        } else {
            memberEmails = Collections.emptyList();
            members = Collections.emptyList();
        }

        dto.setMemberEmails(memberEmails);
        dto.setMembers(members);
        dto.setCompanyId(team.getCompany() != null ? team.getCompany().getId() : null);

        return dto;
    }

    @Override
    public Team toEntity(TeamDto dto) {
        if (dto == null) return null;

        Team team = new Team();

        if(dto.getId() != null) {
            team.setId(dto.getId());
        }

        team.setName(dto.getName());
        team.setDescription(dto.getDescription());

        Company company = companyRepository.getById(dto.getCompanyId());
        team.setCompany(company);

        if (dto.getMemberEmails() != null && !dto.getMemberEmails().isEmpty()) {
            Set<User> members = new HashSet<>();

            for(String memberEmail: dto.getMemberEmails()){
                User member = userRepository.findByEmail(memberEmail)
                        .orElseThrow(() -> new RuntimeException("User not found with email: " + memberEmail));
                members.add(member);
            }

            team.setMembers(members);
        } else {
            team.setMembers(new HashSet<>());
        }

        return team;
    }

    public Team toEntity(TeamDto dto, Company company, Set<User> members) {
        if (dto == null) return null;

        Team team = new Team();
        team.setId(dto.getId());
        team.setName(dto.getName());
        team.setDescription(dto.getDescription());
        team.setCompany(company);
        team.setMembers(members != null ? members : new HashSet<>());
        return team;
    }
}
