package com.biswas.project_management_backend.controller.impl;

import com.biswas.project_management_backend.controller.auth.AuthApi;
import com.biswas.project_management_backend.dto.AuthResponseDto;
import com.biswas.project_management_backend.dto.LoginRequestDto;
import com.biswas.project_management_backend.dto.RegisterCompanyRequestDto;
import com.biswas.project_management_backend.dto.RegisterRequestDto;
import com.biswas.project_management_backend.security.JwtUtil;
import com.biswas.project_management_backend.service.AuthService;
import com.biswas.project_management_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AuthApiController implements AuthApi {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthService authService;

    @Override
    public ResponseEntity<AuthResponseDto> register(RegisterCompanyRequestDto request) {
        AuthResponseDto response = userService.registerCompanyWithAdmin(request);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<AuthResponseDto> register(RegisterRequestDto request) {
        AuthResponseDto response = userService.registerUserWithJoinCode(request);
        return ResponseEntity.ok(response);
    }

    @Override
    public AuthResponseDto login(LoginRequestDto request) {
        return userService.login(request);
    }

    @Override
    public ResponseEntity<?> changePassword(Map<String, String> payload, @AuthenticationPrincipal UserDetails userDetails) {
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
