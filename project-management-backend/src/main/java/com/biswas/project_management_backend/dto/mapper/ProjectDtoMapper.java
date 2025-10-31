package com.biswas.project_management_backend.dto.mapper;

import com.biswas.project_management_backend.dto.ProjectDto;
import com.biswas.project_management_backend.dto.UserDto;
import com.biswas.project_management_backend.model.Company;
import com.biswas.project_management_backend.model.Project;
import com.biswas.project_management_backend.model.Team;
import com.biswas.project_management_backend.model.User;
import com.biswas.project_management_backend.repository.CompanyRepository;
import com.biswas.project_management_backend.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProjectDtoMapper implements DtoMapper<Project, ProjectDto> {

    private final UserDtoMapper userDtoMapper;
    private final TeamDtoMapper teamDtoMapper;
    private final CompanyRepository companyRepository;
    private final TeamRepository teamRepository;

    @Override
    public ProjectDto toDto(Project project) {
        if (project == null) return null;

        ProjectDto dto = new ProjectDto();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setStartDate(project.getStartDate());
        dto.setEndDate(project.getEndDate());
        dto.setStatus(project.getStatus());
        dto.setCreatedById(project.getCreatedById());

        if (project.getTeam() != null) {
            Team team = project.getTeam();
            dto.setTeam(teamDtoMapper.toDto(team));

            List<UserDto> members = team.getMembers() != null
                    ? team.getMembers().stream().map(userDtoMapper::toDto).collect(Collectors.toList())
                    : new ArrayList<>();

            dto.setMembers(members);
            dto.setMemberCount(members.size());
        } else {
            dto.setMembers(new ArrayList<>());
            dto.setMemberCount(0);
        }

        dto.setTaskCount(project.getTasks() != null ? (long) project.getTasks().size() : 0L);
        return dto;
    }

    @Override
    public Project toEntity(ProjectDto dto) {
        if (dto == null) return null;

        Project project = new Project();
        project.setId(dto.getId());
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setStartDate(dto.getStartDate());
        project.setEndDate(dto.getEndDate());
        project.setStatus(dto.getStatus());
        project.setCreatedById(dto.getCreatedById());

        if (dto.getTeam() != null) {
            Team team = teamDtoMapper.toEntity(dto.getTeam());
            if (team != null && team.getId() != null) {
                Team fullTeam = teamRepository.getById(team.getId());
                Set<User> members = fullTeam.getMembers() != null ? fullTeam.getMembers() : new HashSet<>();
                project.setMembers(members);
                project.setTeam(fullTeam);
            }
        }

        if (dto.getCompanyId() != null) {
            Company company = companyRepository.getById(dto.getCompanyId());
            project.setCompany(company);
        }

        return project;
    }
}
