package com.biswas.project_management_backend.service;

import com.biswas.project_management_backend.dto.*;
import java.util.List;
import java.util.Set;

public interface UserService {

    // ---------------- AUTH ----------------
    AuthResponseDto registerCompanyWithAdmin(RegisterCompanyRequestDto request);
    AuthResponseDto registerUserWithJoinCode(RegisterRequestDto request);
    AuthResponseDto login(LoginRequestDto authRequest);
    AuthResponseDto refreshToken(String refreshTokenStr);
    void logout(String refreshTokenStr);

    // ---------------- CRUD ----------------
    UserDto createUser(UserDto dto, String rawPassword);
    List<UserDto> getAllUsers(Long companyId);
    UserDto getUser(Long id);
    UserDto updateUser(Long id, UserDto dto);
    void deleteUser(Long id);
    UserDto updateUserRoles(Long userId, Set<String> roleNames);
    void adminUpdatePassword(Long userId, String newPassword);
}
