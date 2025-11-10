package com.biswas.project_management_backend.controller.impl;

import com.biswas.project_management_backend.controller.auth.AuthApi;
import com.biswas.project_management_backend.dto.AuthResponseDto;
import com.biswas.project_management_backend.dto.LoginRequestDto;
import com.biswas.project_management_backend.dto.RefreshTokenRequestDto;
import com.biswas.project_management_backend.dto.RegisterCompanyRequestDto;
import com.biswas.project_management_backend.dto.RegisterRequestDto;
import com.biswas.project_management_backend.security.JwtUtil;
import com.biswas.project_management_backend.service.AuthService;
import com.biswas.project_management_backend.service.impl.RefreshTokenServiceImpl;
import com.biswas.project_management_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AuthApiController implements AuthApi {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final AuthService authService;

    @Value("${app.environment:local}")
    private String environment;

    @Autowired
    private RefreshTokenServiceImpl refreshTokenServiceImpl;

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
    public ResponseEntity<AuthResponseDto> login(LoginRequestDto request) {
        AuthResponseDto response = userService.login(request);

        // Create refresh token cookie
        ResponseCookie refreshCookie = buildCookie(response.getRefreshToken(), 7 * 24 * 60 * 60); // 7 days

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(new AuthResponseDto(response.getToken(), null, response.getUser()));
    }

    @Override
    public ResponseEntity<AuthResponseDto> refresh(
            @CookieValue(value = "refreshToken", required = false) String refreshTokenCookie) {
        try {
            if (refreshTokenCookie == null || refreshTokenCookie.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }

            AuthResponseDto response = userService.refreshToken(refreshTokenCookie);

            ResponseCookie newCookie = buildCookie(response.getRefreshToken(), 7 * 24 * 60 * 60); // 7 days

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, newCookie.toString())
                    .body(new AuthResponseDto(response.getToken(), null, response.getUser()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @Override
    public ResponseEntity<String> logout(@CookieValue(value = "refreshToken", required = false) String refreshTokenCookie) {
        try {
            if (refreshTokenCookie != null && !refreshTokenCookie.isEmpty()) {
                userService.logout(refreshTokenCookie);
            }

            // Delete cookie by setting maxAge = 0
            ResponseCookie clearedCookie = ResponseCookie.from("refreshToken", "")
                    .httpOnly(true)
                    .secure(environment.equalsIgnoreCase("prod") || environment.equalsIgnoreCase("docker"))
                    .sameSite("None")
                    .path("/")
                    .maxAge(0)
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, clearedCookie.toString())
                    .body("Logged out successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Logout failed: " + e.getMessage());
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

    private ResponseCookie buildCookie(String value, long maxAge) {
        boolean isProd = environment.equalsIgnoreCase("prod") || environment.equalsIgnoreCase("docker");

        return ResponseCookie.from("refreshToken", value)
                .httpOnly(true)
                .secure(isProd) // true in prod or docker, false in localhost
                .sameSite(isProd ? "None" : "Lax") // cross-site for prod, Lax for local
                .path("/")
                .maxAge(maxAge)
                .build();
    }
}
