package com.biswas.project_management_backend.controller;

import com.biswas.project_management_backend.dto.AuthRequestDto;
import com.biswas.project_management_backend.dto.AuthResponseDto;
import com.biswas.project_management_backend.dto.RegisterRequestDto;
import com.biswas.project_management_backend.model.User;
import com.biswas.project_management_backend.security.JwtUtil;
import com.biswas.project_management_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@RequestBody RegisterRequestDto request) {
        User savedUser = userService.registerUser(request);
        String token = jwtUtil.generateToken(savedUser.getUsername());
        return ResponseEntity.ok(new AuthResponseDto(token));
    }

    @PostMapping("/login")
    public AuthResponseDto login(@RequestBody AuthRequestDto request) {
        return userService.login(request);
    }
}

