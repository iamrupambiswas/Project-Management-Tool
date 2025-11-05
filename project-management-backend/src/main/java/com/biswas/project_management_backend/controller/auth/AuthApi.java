package com.biswas.project_management_backend.controller.auth;

import com.biswas.project_management_backend.dto.AuthResponseDto;
import com.biswas.project_management_backend.dto.LoginRequestDto;
import com.biswas.project_management_backend.dto.RegisterCompanyRequestDto;
import com.biswas.project_management_backend.dto.RegisterRequestDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RequestMapping("/api/auth")
public interface AuthApi {

    @PostMapping("/register/company")
    ResponseEntity<AuthResponseDto> register(@RequestBody RegisterCompanyRequestDto request);

    @PostMapping("/register")
    ResponseEntity<AuthResponseDto> register(@RequestBody RegisterRequestDto request);

    @PostMapping("/login")
    AuthResponseDto login(@RequestBody LoginRequestDto request);

    @PostMapping("/change-password")
    ResponseEntity<?> changePassword(
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal UserDetails userDetails
    );
}
