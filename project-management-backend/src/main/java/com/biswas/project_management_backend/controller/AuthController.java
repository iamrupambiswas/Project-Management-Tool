package com.biswas.project_management_backend.controller;

import com.biswas.project_management_backend.dto.AuthResponseDto;
import com.biswas.project_management_backend.dto.LoginRequestDto;
import com.biswas.project_management_backend.dto.RegisterCompanyRequestDto;
import com.biswas.project_management_backend.dto.RegisterRequestDto;
import com.biswas.project_management_backend.security.JwtUtil;
import com.biswas.project_management_backend.service.AuthService;
import com.biswas.project_management_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    @Autowired
    UserService userService;

    @Autowired
    private final JwtUtil jwtUtil;

    @Autowired
    AuthService authService;

    @PostMapping("/register/company")
    public ResponseEntity<AuthResponseDto> register(@RequestBody RegisterCompanyRequestDto request) {
        AuthResponseDto response = userService.registerCompanyWithAdmin(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@RequestBody RegisterRequestDto request) {
        AuthResponseDto response = userService.registerUserWithJoinCode(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public AuthResponseDto login(@RequestBody LoginRequestDto request) {
        return userService.login(request);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal UserDetails userDetails) {

        String oldPassword = payload.get("oldPassword");
        String newPassword = payload.get("newPassword");

        boolean success = authService.changePassword(userDetails.getUsername(), oldPassword, newPassword);
        if (success) {
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid old password"));
        }
    }

}

