package com.biswas.project_management_backend.controller.impl;

import com.biswas.project_management_backend.controller.auth.AuthApi;
import com.biswas.project_management_backend.dto.AuthResponseDto;
import com.biswas.project_management_backend.dto.LoginRequestDto;
import com.biswas.project_management_backend.dto.RefreshTokenRequestDto;
import com.biswas.project_management_backend.dto.RegisterCompanyRequestDto;
import com.biswas.project_management_backend.dto.RegisterRequestDto;
import com.biswas.project_management_backend.security.JwtUtil;
import com.biswas.project_management_backend.service.AuthService;
import com.biswas.project_management_backend.service.RefreshTokenService;
import com.biswas.project_management_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AuthApiController implements AuthApi {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final AuthService authService;

    @Autowired
    private RefreshTokenService refreshTokenService;

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
    public ResponseEntity<AuthResponseDto> refresh(RefreshTokenRequestDto request) {
        try {
            AuthResponseDto response = userService.refreshToken(request.getRefreshToken());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @Override
    public ResponseEntity<String> logout(RefreshTokenRequestDto request) {
        try {
            userService.logout(request.getRefreshToken());
            return ResponseEntity.ok("Logged out successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
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
