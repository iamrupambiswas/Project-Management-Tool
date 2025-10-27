package com.biswas.project_management_backend.controller;

import com.biswas.project_management_backend.dto.UserAnalyticsDto;
import com.biswas.project_management_backend.dto.UserDto;
import com.biswas.project_management_backend.service.AnalyticsService;
import com.biswas.project_management_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/company/{companyId}")
    public List<UserDto> getAllUsers(@PathVariable Long companyId){
        return userService.getAllUsers(companyId);
    }

    @GetMapping("/{id}")
    public UserDto getUser(@PathVariable Long id){
        return userService.getUser(id);
    }

    @GetMapping("/analytics")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserAnalyticsDto> getUserAnalytics(@RequestParam Long companyId, Authentication auth) {
        String username = auth.getName();
        UserAnalyticsDto analytics = analyticsService.getUserAnalytics(username, companyId);
        return ResponseEntity.ok(analytics);
    }

}
