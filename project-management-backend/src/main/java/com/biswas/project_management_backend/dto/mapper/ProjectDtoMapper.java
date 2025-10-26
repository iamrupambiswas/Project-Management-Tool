package com.biswas.project_management_backend.dto.mapper;

import com.biswas.project_management_backend.dto.ProjectDto;
import com.biswas.project_management_backend.dto.UserDto;
import com.biswas.project_management_backend.model.Company;
import com.biswas.project_management_backend.model.Project;
import com.biswas.project_management_backend.model.Team;
import com.biswas.project_management_backend.model.User;
import com.biswas.project_management_backend.repository.CompanyRepository;
import com.biswas.project_management_backend.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class ProjectDtoMapper {

    @Autowired
    UserDtoMapper userDtoMapper;

    @Autowired
    TeamDtoMapper teamDtoMapper;

    @Autowired
    CompanyRepository companyRepository;

    @Autowired
    TeamRepository teamRepository;

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
        if (project.getTeam() != null) {
            dto.setTeam(teamDtoMapper.toDto(project.getTeam()));

            // Populate members and member count from team
            Team team = project.getTeam();
            if (team.getMembers() != null && !team.getMembers().isEmpty()) {
                List<UserDto> memberDtos = new ArrayList<>();
                for (User member : team.getMembers()) {
                    memberDtos.add(userDtoMapper.toDto(member));
                }
                dto.setMembers(memberDtos);
                dto.setMemberCount(memberDtos.size());
            } else {
                dto.setMembers(new ArrayList<>());
                dto.setMemberCount(0);
            }
        } else {
            dto.setMembers(new ArrayList<>());
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

    public Project toEntity(ProjectDto dto) {
        if (dto == null) return null;

        Project project = new Project();

        // Map basic fields
        if (dto.getId() != null) {
            project.setId(dto.getId());
        }
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setStartDate(dto.getStartDate());
        project.setEndDate(dto.getEndDate());
        project.setStatus(dto.getStatus());
        project.setCreatedById(dto.getCreatedById());

        // Map team
        Team team = teamDtoMapper.toEntity(dto.getTeam());
        project.setTeam(team);

        // Fetch members from team repository if team is not null
        if (team != null && team.getId() != null) {
            Team fullTeam = teamRepository.getById(team.getId()); // fetch complete team from DB

            if (fullTeam.getMembers() != null && !fullTeam.getMembers().isEmpty()) {
                Set<User> projectMembers = new HashSet<>();
                for (User member : fullTeam.getMembers()) {
                    projectMembers.add(member); // add User entities
                }
                project.setMembers(projectMembers);
            } else {
                project.setMembers(new HashSet<>());
            }
        }

        // Map company
        Company company = companyRepository.getById(dto.getCompanyId());
        project.setCompany(company);

        return project;
    }
}
