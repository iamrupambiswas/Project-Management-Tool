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
import java.util.Map;

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

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UserDto dto) {
        UserDto updated = userService.updateUser(id, dto);
        return ResponseEntity.ok(updated);
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

    @PutMapping("/{userId}/password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateUserPassword(
            @PathVariable Long userId,
            @RequestBody Map<String, String> body
    ) {
        String newPassword = body.get("newPassword");
        if (newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        userService.adminUpdatePassword(userId, newPassword);
        return ResponseEntity.noContent().build();
    }

}
