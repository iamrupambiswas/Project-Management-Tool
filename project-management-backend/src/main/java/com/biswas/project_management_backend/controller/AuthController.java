package com.biswas.project_management_backend.controller;

import com.biswas.project_management_backend.dto.AuthRequestDto;
import com.biswas.project_management_backend.dto.AuthResponseDto;
import com.biswas.project_management_backend.dto.CompanyRegisterRequestDto;
import com.biswas.project_management_backend.dto.RegisterRequestDto;
import com.biswas.project_management_backend.exception.ResourceNotFoundException;
import com.biswas.project_management_backend.model.User;
import com.biswas.project_management_backend.security.JwtUtil;
import com.biswas.project_management_backend.service.CompanyService;
import com.biswas.project_management_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final CompanyService companyService; 
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@Valid @RequestBody RegisterRequestDto request) {
        User savedUser = userService.registerUser(request);
        String token = jwtUtil.generateToken(savedUser);
        Long companyId = (savedUser.getCompany() != null) ? savedUser.getCompany().getId() : null;
        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponseDto(token, companyId));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody AuthRequestDto request) {
        // The userService.login method is expected to handle authentication and return the authenticated User object.
        User authenticatedUser = userService.login(request);
        
        // Generate JWT for the authenticated user.
        String token = jwtUtil.generateToken(authenticatedUser);
        
        // Extract companyId from the authenticated user.
        Long companyId = authenticatedUser.getCompany() != null ? authenticatedUser.getCompany().getId() : null;
        
        return ResponseEntity.ok(new AuthResponseDto(token, companyId));
    }

    /**
     * Endpoint to register a new company along with its first admin user.
     *
     * @param request The DTO containing company and admin user registration details.
     * @return AuthResponseDto with JWT and companyId upon successful registration and login.
     */
    @PostMapping("/companies/register")
    public ResponseEntity<AuthResponseDto> registerCompany(@Valid @RequestBody CompanyRegisterRequestDto request) {
        User adminUser = companyService.registerCompanyAndAdmin(request);

        // It's crucial that the adminUser has a company associated here,
        // otherwise, it indicates a logical error in the companyService.
        if (adminUser.getCompany() == null) {
            throw new ResourceNotFoundException("Company not found for the newly registered admin user. This should not happen.");
        }

        // Generate JWT for the newly registered admin user.
        String token = jwtUtil.generateToken(adminUser);

        // The adminUser must have a company associated, validated above.
        Long companyId = adminUser.getCompany().getId();

        // Return AuthResponseDto with the generated token and companyId.
        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponseDto(token, companyId));
    }
}