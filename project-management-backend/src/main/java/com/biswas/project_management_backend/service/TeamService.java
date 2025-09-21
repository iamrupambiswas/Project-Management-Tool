package com.biswas.project_management_backend.service;

import com.biswas.project_management_backend.dto.InviteRequest;
import com.biswas.project_management_backend.dto.TeamDto;
import com.biswas.project_management_backend.model.Team;
import com.biswas.project_management_backend.model.User;
import com.biswas.project_management_backend.repository.TeamRepository;
import com.biswas.project_management_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;

    // ---------------- CREATE ----------------
    public TeamDto createTeam(TeamDto dto) {
        if (teamRepository.existsByName(dto.getName())) {
            throw new RuntimeException("Team name already exists");
        }

        Team team = Team.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .build();

        Team saved = teamRepository.save(team);
        return mapToDto(saved);
    }

    // ---------------- ADD MEMBER ----------------
    public TeamDto addMember(Long teamId, InviteRequest inviteRequest) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        User user = userRepository.findByEmail(inviteRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        team.getMembers().add(user);
        Team updated = teamRepository.save(team);
        return mapToDto(updated);
    }

    // ---------------- REMOVE MEMBER ----------------
    public TeamDto removeMember(Long teamId, Long userId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        team.getMembers().remove(user);
        Team updated = teamRepository.save(team);
        return mapToDto(updated);
    }

    // ---------------- GET ALL ----------------
    public List<TeamDto> getAllTeams() {
        return teamRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // ---------------- GET BY ID ----------------
    public TeamDto getTeam(Long id) {
        return teamRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Team not found"));
    }

    // ---------------- MAPPER ----------------
    private TeamDto mapToDto(Team team) {
        return TeamDto.builder()
                .id(team.getId())
                .name(team.getName())
                .description(team.getDescription())
                .members(
                        team.getMembers().stream()
                                .map(User::getUsername) // or user.getEmail()
                                .collect(Collectors.toSet())
                )
                .build();
    }
}
