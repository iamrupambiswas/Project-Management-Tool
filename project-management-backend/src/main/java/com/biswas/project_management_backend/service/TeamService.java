package com.biswas.project_management_backend.service;

import com.biswas.project_management_backend.dto.InviteRequest;
import com.biswas.project_management_backend.dto.TeamDto;
import com.biswas.project_management_backend.dto.UserDto;

import java.util.List;

public interface TeamService {

    TeamDto createTeam(TeamDto dto);
    TeamDto updateTeam(Long id, TeamDto dto);
    TeamDto addMember(Long teamId, InviteRequest inviteRequest);
    TeamDto removeMember(Long teamId, Long userId);
    List<TeamDto> getAllTeams(Long companyId);
    TeamDto getTeam(Long id);
    List<UserDto> getMembersOfTeam(Long id);

}
