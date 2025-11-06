package com.biswas.project_management_backend.service;

import com.biswas.project_management_backend.dto.*;
import com.biswas.project_management_backend.dto.mapper.UserDtoMapper;
import com.biswas.project_management_backend.model.Company;
import com.biswas.project_management_backend.model.RefreshToken;
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
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDtoMapper userDtoMapper;
    private final RoleRepository roleRepository;
    private final CompanyRepository companyRepository;
    private final RefreshTokenService refreshTokenService;

    // ---------------- AUTH ----------------
    public AuthResponseDto registerCompanyWithAdmin(RegisterCompanyRequestDto request) {

        Company company = Company.builder()
                .name(request.getCompanyName())
                .domain(request.getDomain())
                .build();
        Company savedCompany = companyRepository.save(company);

        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseThrow(() -> new RuntimeException("Default role ADMIN not found"));

        User admin = User.builder()
                .username(request.getAdmin().getName())
                .email(request.getAdmin().getEmail())
                .password(passwordEncoder.encode(request.getAdmin().getPassword()))
                .roles(Collections.singleton(adminRole))
                .company(savedCompany)
                .build();
        User savedAdmin = userRepository.save(admin);

        Map<String, Object> claims = new HashMap<>();
        claims.put("companyId", savedCompany.getId());
        String token = jwtUtil.generateToken(savedAdmin.getEmail(), claims);

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(savedAdmin.getId());

        UserDto userDto = userDtoMapper.toDto(savedAdmin);

        return new AuthResponseDto(token, refreshToken.getToken(), userDto);
    }


    public AuthResponseDto registerUserWithJoinCode(RegisterRequestDto request) {

        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Default role USER not found"));

        Company company = null;
        if (request.getJoinCode() != null && !request.getJoinCode().isEmpty()) {
            company = companyRepository.findByJoinCode(request.getJoinCode())
                    .orElseThrow(() -> new RuntimeException("Invalid join code"));
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Collections.singleton(userRole))
                .company(company)
                .build();

        User savedUser = userRepository.save(user);

        Map<String, Object> claims = new HashMap<>();
        if (company != null) claims.put("companyId", company.getId());
        String token = jwtUtil.generateToken(savedUser.getEmail(), claims);

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(savedUser.getId());

        UserDto userDto = userDtoMapper.toDto(savedUser);

        return new AuthResponseDto(token, refreshToken.getToken(), userDto);
    }



    public AuthResponseDto login(LoginRequestDto authRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.getEmail(),
                        authRequest.getPassword()
                )
        );

        User user = userRepository.findByEmail(authRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setLastActiveDate(LocalDate.now());
        userRepository.save(user);

        Map<String, Object> claims = new HashMap<>();
        if (user.getCompany() != null) {
            claims.put("companyId", user.getCompany().getId());
        }

        String token = jwtUtil.generateToken(authRequest.getEmail(), claims);

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        UserDto userDto = userDtoMapper.toDto(user);

        return new AuthResponseDto(token, refreshToken.getToken(), userDto);
    }

    public AuthResponseDto refreshToken(String refreshTokenStr) {
        RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenStr)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        refreshToken = refreshTokenService.verifyExpiration(refreshToken);

        User user = refreshToken.getUser();

        Map<String, Object> claims = new HashMap<>();
        if (user.getCompany() != null) {
            claims.put("companyId", user.getCompany().getId());
        }
        String newAccessToken = jwtUtil.generateToken(user.getEmail(), claims);

        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user.getId());

        UserDto userDto = userDtoMapper.toDto(user);

        return new AuthResponseDto(newAccessToken, newRefreshToken.getToken(), userDto);
    }

    public void logout(String refreshTokenStr) {
        RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenStr)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        refreshTokenService.deleteByUserId(refreshToken.getUser().getId());
    }

    // ---------------- CRUD ----------------
    public UserDto createUser(UserDto dto, String rawPassword) {

        // Convert roles from DTO (if present)
        Set<Role> roles = new HashSet<>();
        if (dto.getRoles() != null) {
            for (String roleName : dto.getRoles()) {
                Role role = roleRepository.findByName(roleName)
                        .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
                roles.add(role);
            }
        }

        User user = User.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(rawPassword))
                .roles(roles)
                .build();

        User saved = userRepository.save(user);
        return userDtoMapper.toDto(saved);
    }

    public List<UserDto> getAllUsers(Long companyId) {
        List<User> users = userRepository.findByCompanyId(companyId);
        List<UserDto> userDtos = new ArrayList<>();
        for(User user: users){
            UserDto userDto = userDtoMapper.toDto(user);
            userDtos.add(userDto);
        }
        return userDtos;
    }

    public UserDto getUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userDtoMapper.toDto(user);
    }

    public UserDto updateUser(Long id, UserDto dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());

        // Update roles properly
        if (dto.getRoles() != null) {
            Set<Role> roles = new HashSet<>();
            for (String roleName : dto.getRoles()) {
                Role role = roleRepository.findByName(roleName)
                        .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
                roles.add(role);
            }
            user.setRoles(roles);
        }

        User updated = userRepository.save(user);
        return userDtoMapper.toDto(updated);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public UserDto updateUserRoles(Long userId, Set<String> roleNames) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Fetch roles from DB by name
        Set<Role> newRoles = roleNames.stream()
                .map(name -> roleRepository.findByName(name)
                        .orElseThrow(() -> new RuntimeException("Role not found: " + name)))
                .collect(Collectors.toSet());

        user.setRoles(newRoles);

        User updatedUser = userRepository.save(user);
        return userDtoMapper.toDto(updatedUser);
    }


}