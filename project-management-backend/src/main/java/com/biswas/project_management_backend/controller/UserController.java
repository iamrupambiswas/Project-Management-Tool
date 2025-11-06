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
import java.util.Set;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AnalyticsService analyticsService;

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
        String userEmail = auth.getName();
        UserAnalyticsDto analytics = analyticsService.getUserAnalytics(userEmail, companyId);
        return ResponseEntity.ok(analytics);
    }

    @PutMapping("/{userId}/roles")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_MANAGER')")
    public ResponseEntity<UserDto> updateUserRoles(
            @PathVariable Long userId,
            @RequestBody Set<String> roleNames
    ) {
        UserDto updatedUser = userService.updateUserRoles(userId, roleNames);
        return ResponseEntity.ok(updatedUser);
    }

}
