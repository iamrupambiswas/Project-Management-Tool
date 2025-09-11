package com.biswas.project_management_backend.service;

import com.biswas.project_management_backend.dto.AuthRequestDto;
import com.biswas.project_management_backend.dto.AuthResponseDto;
import com.biswas.project_management_backend.dto.RegisterRequestDto;
import com.biswas.project_management_backend.dto.UserDto;
import com.biswas.project_management_backend.model.Role;
import com.biswas.project_management_backend.model.User;
import com.biswas.project_management_backend.repository.RoleRepository;
import com.biswas.project_management_backend.repository.UserRepository;
import com.biswas.project_management_backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    // ---------------- AUTH ----------------
    public User registerUser(RegisterRequestDto request) {
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Default role not found"));

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Collections.singleton(userRole))
                .build();

        return userRepository.save(user);
    }

    public AuthResponseDto login(AuthRequestDto authRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.getUsername(),
                        authRequest.getPassword()
                )
        );
        String token = jwtUtil.generateToken(authRequest.getUsername());
        return new AuthResponseDto(token);
    }

    // ---------------- CRUD ----------------
    public UserDto createUser(UserDto dto, String rawPassword) {
        Set<Role> roles = dto.getRoles().stream()
                .map(roleName -> roleRepository.findByName(roleName)
                        .orElseThrow(() -> new RuntimeException("Role not found: " + roleName)))
                .collect(Collectors.toSet());

        User user = User.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(rawPassword))
                .roles(roles)
                .build();

        User saved = userRepository.save(user);
        return mapToDto(saved);
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public UserDto getUser(Long id) {
        return userRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UserDto updateUser(Long id, UserDto dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());

        if (dto.getRoles() != null) {
            Set<Role> roles = dto.getRoles().stream()
                    .map(roleName -> roleRepository.findByName(roleName)
                            .orElseThrow(() -> new RuntimeException("Role not found: " + roleName)))
                    .collect(Collectors.toSet());
            user.setRoles(roles);
        }

        User updated = userRepository.save(user);
        return mapToDto(updated);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // ---------------- MAPPER ----------------
    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()))
                .build();
    }
}