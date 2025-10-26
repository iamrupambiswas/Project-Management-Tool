package com.biswas.project_management_backend.service;

import com.biswas.project_management_backend.dto.InviteRequest;
import com.biswas.project_management_backend.dto.TeamDto;
import com.biswas.project_management_backend.dto.UserDto;
import com.biswas.project_management_backend.dto.mapper.TeamDtoMapper;
import com.biswas.project_management_backend.dto.mapper.UserDtoMapper;
import com.biswas.project_management_backend.model.Team;
import com.biswas.project_management_backend.model.User;
import com.biswas.project_management_backend.repository.TeamRepository;
import com.biswas.project_management_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;

    @Autowired
    TeamDtoMapper dtoMapper;

    @Autowired
    UserDtoMapper userDtoMapper;

    // ---------------- CREATE ----------------
    public TeamDto createTeam(TeamDto dto) {
        if (teamRepository.existsByName(dto.getName())) {
            throw new RuntimeException("Team name already exists");
        }

        Team team = dtoMapper.toEntity(dto);

        Team saved = teamRepository.save(team);
        return dtoMapper.toDto(saved);
    }

    public TeamDto addMember(Long teamId, InviteRequest inviteRequest) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        User user = userRepository.findByEmail(inviteRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        team.getMembers().add(user);
        Team updated = teamRepository.save(team);
        return dtoMapper.toDto(updated);
    }

    public TeamDto removeMember(Long teamId, Long userId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        team.getMembers().remove(user);
        Team updated = teamRepository.save(team);
        return dtoMapper.toDto(updated);
    }

    public List<TeamDto> getAllTeams(Long companyId) {
        List<Team> teams = teamRepository.findByCompanyId(companyId);
        List<TeamDto> teamDtos = new ArrayList<>();

        for(Team team: teams) {
            teamDtos.add(dtoMapper.toDto(team));
        }

        return teamDtos;
    }

    public TeamDto getTeam(Long id) {
        Team team = teamRepository.getById(id);
        return dtoMapper.toDto(team);
    }

    public List<UserDto> getMembersOfTeam(Long id) {
        Team team = teamRepository.getById(id);

        List<UserDto> membersDto = new ArrayList<>();
        for (User user : team.getMembers()) {
            membersDto.add(userDtoMapper.toDto(user));
        }

        return membersDto;
    }

}
