package com.biswas.project_management_backend.controller;

import com.biswas.project_management_backend.dto.InviteRequest;
import com.biswas.project_management_backend.dto.TeamDto;
import com.biswas.project_management_backend.dto.UserDto;
import com.biswas.project_management_backend.model.User;
import com.biswas.project_management_backend.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    @PostMapping
    public ResponseEntity<TeamDto> createTeam(@RequestBody TeamDto dto) {
        return ResponseEntity.ok(teamService.createTeam(dto));
    }

    @GetMapping
    public ResponseEntity<List<TeamDto>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamDto> getTeam(@PathVariable Long id) {
        return ResponseEntity.ok(teamService.getTeam(id));
    }

    @PostMapping("/{teamId}/members")
    public ResponseEntity<TeamDto> addMember(
            @PathVariable Long teamId,
            @RequestBody InviteRequest inviteRequest) {
        return ResponseEntity.ok(teamService.addMember(teamId, inviteRequest));
    }

    @DeleteMapping("/{teamId}/members/{userId}")
    public ResponseEntity<TeamDto> removeMember(@PathVariable Long teamId, @PathVariable Long userId) {
        return ResponseEntity.ok(teamService.removeMember(teamId, userId));
    }

    @GetMapping("/{teamId}/members")
    public ResponseEntity<List<UserDto>> getMembersOfTeam(@PathVariable Long teamId) {
        List<UserDto> members = teamService.getMembersOfTeam(teamId);
        return ResponseEntity.ok(members);
    }
}