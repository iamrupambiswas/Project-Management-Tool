package com.biswas.project_management_backend.service;

import com.biswas.project_management_backend.dto.*;
<<<<<<< HEAD
=======
import com.biswas.project_management_backend.dto.mapper.UserDtoMapper;
import com.biswas.project_management_backend.model.Company;
import com.biswas.project_management_backend.model.Role;
import com.biswas.project_management_backend.model.User;
import com.biswas.project_management_backend.repository.CompanyRepository;
import com.biswas.project_management_backend.repository.RoleRepository;
import com.biswas.project_management_backend.repository.UserRepository;
import com.biswas.project_management_backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
>>>>>>> 70d91563452f25891833f3cf430f48834c5aaf6c

import java.util.*;

public interface UserService {

<<<<<<< HEAD
    AuthResponseDto registerCompanyWithAdmin(RegisterCompanyRequestDto request);
    AuthResponseDto registerUserWithJoinCode(RegisterRequestDto request);
    AuthResponseDto login(LoginRequestDto authRequest);
    UserDto createUser(UserDto dto, String rawPassword);
    List<UserDto> getAllUsers(Long companyId);
    UserDto getUser(Long id);
    UserDto updateUser(Long id, UserDto dto);
    void deleteUser(Long id);
    UserDto updateUserRoles(Long userId, Set<String> roleNames);
=======
    public void adminUpdatePassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

>>>>>>> 70d91563452f25891833f3cf430f48834c5aaf6c

}