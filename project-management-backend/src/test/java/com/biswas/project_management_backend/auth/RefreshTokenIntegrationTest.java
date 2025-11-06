package com.biswas.project_management_backend.auth;

import com.biswas.project_management_backend.dto.AuthResponseDto;
import com.biswas.project_management_backend.dto.LoginRequestDto;
import com.biswas.project_management_backend.dto.RefreshTokenRequestDto;
import com.biswas.project_management_backend.dto.RegisterCompanyRequestDto;
import com.biswas.project_management_backend.model.RefreshToken;
import com.biswas.project_management_backend.repository.RefreshTokenRepository;
import com.biswas.project_management_backend.repository.UserRepository;
import com.biswas.project_management_backend.service.ImageUploadService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {
    "spring.autoconfigure.exclude=org.springframework.ai.autoconfigure.openai.OpenAiAutoConfiguration"
})
@AutoConfigureMockMvc
@ActiveProfiles("local") // Use local profile to connect to real PostgreSQL database
@Transactional
@Rollback // Rollback after each test to keep DB clean
class RefreshTokenIntegrationTest {

    @MockitoBean
    private OpenAiChatModel openAiChatModel;

    @MockitoBean
    private ChatClient chatClient;

    @MockitoBean
    private ImageUploadService imageUploadService;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserRepository userRepository;

    private RegisterCompanyRequestDto companyRequest;
    private LoginRequestDto loginRequest;

    @BeforeEach
    void setUp() {
        // Prepare test data - roles already exist in real DB from Flyway migrations
        RegisterCompanyRequestDto.AdminDto admin = new RegisterCompanyRequestDto.AdminDto();
        admin.setName("Test Admin User");
        admin.setEmail("testadmin" + System.currentTimeMillis() + "@test.com"); // Unique email
        admin.setPassword("password123");

        companyRequest = new RegisterCompanyRequestDto();
        companyRequest.setCompanyName("Test Company " + System.currentTimeMillis());
        companyRequest.setDomain("testcompany" + System.currentTimeMillis() + ".com");
        companyRequest.setAdmin(admin);

        loginRequest = new LoginRequestDto();
        loginRequest.setEmail(admin.getEmail());
        loginRequest.setPassword("password123");
    }

    @Test
    @DisplayName("Login should generate both access token and refresh token")
    void testLoginGeneratesRefreshToken() throws Exception {
        // Register a company with admin
        mockMvc.perform(post("/api/auth/register/company")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(companyRequest)))
                .andExpect(status().isOk());

        // Login
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.refreshToken").exists())
                .andExpect(jsonPath("$.user").exists())
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        AuthResponseDto response = objectMapper.readValue(responseBody, AuthResponseDto.class);

        // Verify tokens are not null
        assertNotNull(response.getToken());
        assertNotNull(response.getRefreshToken());

        // Verify refresh token is saved in database
        Optional<RefreshToken> savedToken = refreshTokenRepository.findByToken(response.getRefreshToken());
        assertTrue(savedToken.isPresent());
        assertEquals(response.getUser().getEmail(), savedToken.get().getUser().getEmail());
    }

    @Test
    @DisplayName("Refresh endpoint should generate new tokens with valid refresh token")
    void testRefreshTokenWithValidToken() throws Exception {
        // Register and login
        mockMvc.perform(post("/api/auth/register/company")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(companyRequest)));

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        AuthResponseDto loginResponse = objectMapper.readValue(
                loginResult.getResponse().getContentAsString(),
                AuthResponseDto.class
        );

        String originalAccessToken = loginResponse.getToken();
        String originalRefreshToken = loginResponse.getRefreshToken();

        // Wait a moment to ensure new tokens will be different
        Thread.sleep(100);

        // Use refresh token to get new tokens
        RefreshTokenRequestDto refreshRequest = new RefreshTokenRequestDto();
        refreshRequest.setRefreshToken(originalRefreshToken);

        MvcResult refreshResult = mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(refreshRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.refreshToken").exists())
                .andReturn();

        AuthResponseDto refreshResponse = objectMapper.readValue(
                refreshResult.getResponse().getContentAsString(),
                AuthResponseDto.class
        );

        // Verify new tokens are different from original
        assertNotEquals(originalAccessToken, refreshResponse.getToken());
        assertNotEquals(originalRefreshToken, refreshResponse.getRefreshToken());

        // Verify new refresh token exists in database
        Optional<RefreshToken> newToken = refreshTokenRepository.findByToken(refreshResponse.getRefreshToken());
        assertTrue(newToken.isPresent());
    }

    @Test
    @DisplayName("Refresh endpoint should invalidate old refresh token (token rotation)")
    void testRefreshTokenRotation() throws Exception {
        // Register and login
        mockMvc.perform(post("/api/auth/register/company")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(companyRequest)));

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        AuthResponseDto loginResponse = objectMapper.readValue(
                loginResult.getResponse().getContentAsString(),
                AuthResponseDto.class
        );

        String originalRefreshToken = loginResponse.getRefreshToken();

        // Use refresh token
        RefreshTokenRequestDto refreshRequest = new RefreshTokenRequestDto();
        refreshRequest.setRefreshToken(originalRefreshToken);

        mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(refreshRequest)))
                .andExpect(status().isOk());

        // Try to use old refresh token again - should fail
        mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(refreshRequest)))
                .andExpect(status().isUnauthorized());

        // Verify old token no longer exists in database
        Optional<RefreshToken> oldToken = refreshTokenRepository.findByToken(originalRefreshToken);
        assertFalse(oldToken.isPresent());
    }

    @Test
    @DisplayName("Refresh endpoint should fail with invalid refresh token")
    void testRefreshTokenWithInvalidToken() throws Exception {
        RefreshTokenRequestDto invalidRequest = new RefreshTokenRequestDto();
        invalidRequest.setRefreshToken("invalid-token-12345");

        mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Refresh endpoint should fail with expired refresh token")
    void testRefreshTokenWithExpiredToken() throws Exception {
        // Register and login
        mockMvc.perform(post("/api/auth/register/company")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(companyRequest)));

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        AuthResponseDto loginResponse = objectMapper.readValue(
                loginResult.getResponse().getContentAsString(),
                AuthResponseDto.class
        );

        // Manually expire the refresh token in database
        RefreshToken token = refreshTokenRepository.findByToken(loginResponse.getRefreshToken())
                .orElseThrow();
        token.setExpiryDate(Instant.now().minusSeconds(3600)); // Expired 1 hour ago
        refreshTokenRepository.save(token);

        // Try to use expired token
        RefreshTokenRequestDto refreshRequest = new RefreshTokenRequestDto();
        refreshRequest.setRefreshToken(loginResponse.getRefreshToken());

        mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(refreshRequest)))
                .andExpect(status().isUnauthorized());

        // Verify expired token was deleted from database
        Optional<RefreshToken> deletedToken = refreshTokenRepository.findByToken(loginResponse.getRefreshToken());
        assertFalse(deletedToken.isPresent());
    }

    @Test
    @DisplayName("Logout should invalidate refresh token")
    void testLogoutInvalidatesRefreshToken() throws Exception {
        // Register and login
        mockMvc.perform(post("/api/auth/register/company")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(companyRequest)));

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        AuthResponseDto loginResponse = objectMapper.readValue(
                loginResult.getResponse().getContentAsString(),
                AuthResponseDto.class
        );

        String refreshToken = loginResponse.getRefreshToken();

        // Verify token exists before logout
        assertTrue(refreshTokenRepository.findByToken(refreshToken).isPresent());

        // Logout
        RefreshTokenRequestDto logoutRequest = new RefreshTokenRequestDto();
        logoutRequest.setRefreshToken(refreshToken);

        mockMvc.perform(post("/api/auth/logout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(logoutRequest)))
                .andExpect(status().isOk())
                .andExpect(content().string("Logged out successfully"));

        // Verify token no longer exists in database
        assertFalse(refreshTokenRepository.findByToken(refreshToken).isPresent());
    }

    @Test
    @DisplayName("Cannot use refresh token after logout")
    void testCannotUseRefreshTokenAfterLogout() throws Exception {
        // Register and login
        mockMvc.perform(post("/api/auth/register/company")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(companyRequest)));

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        AuthResponseDto loginResponse = objectMapper.readValue(
                loginResult.getResponse().getContentAsString(),
                AuthResponseDto.class
        );

        String refreshToken = loginResponse.getRefreshToken();

        // Logout
        RefreshTokenRequestDto logoutRequest = new RefreshTokenRequestDto();
        logoutRequest.setRefreshToken(refreshToken);

        mockMvc.perform(post("/api/auth/logout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(logoutRequest)));

        // Try to use refresh token after logout - should fail
        RefreshTokenRequestDto refreshRequest = new RefreshTokenRequestDto();
        refreshRequest.setRefreshToken(refreshToken);

        mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(refreshRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Multiple logins should replace previous refresh token (single device strategy)")
    void testSingleDeviceStrategy() throws Exception {
        // Register
        mockMvc.perform(post("/api/auth/register/company")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(companyRequest)));

        // First login
        MvcResult firstLogin = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        AuthResponseDto firstResponse = objectMapper.readValue(
                firstLogin.getResponse().getContentAsString(),
                AuthResponseDto.class
        );

        String firstRefreshToken = firstResponse.getRefreshToken();

        // Wait a moment
        Thread.sleep(100);

        // Second login (simulating login from another device/session)
        MvcResult secondLogin = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        AuthResponseDto secondResponse = objectMapper.readValue(
                secondLogin.getResponse().getContentAsString(),
                AuthResponseDto.class
        );

        String secondRefreshToken = secondResponse.getRefreshToken();

        // Verify tokens are different
        assertNotEquals(firstRefreshToken, secondRefreshToken);

        // Verify first refresh token is no longer valid
        assertFalse(refreshTokenRepository.findByToken(firstRefreshToken).isPresent());

        // Verify second refresh token is valid
        assertTrue(refreshTokenRepository.findByToken(secondRefreshToken).isPresent());
    }

    @Test
    @DisplayName("Registration should generate refresh token")
    void testRegistrationGeneratesRefreshToken() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/auth/register/company")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(companyRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.refreshToken").exists())
                .andExpect(jsonPath("$.user").exists())
                .andReturn();

        AuthResponseDto response = objectMapper.readValue(
                result.getResponse().getContentAsString(),
                AuthResponseDto.class
        );

        // Verify refresh token exists in database
        Optional<RefreshToken> savedToken = refreshTokenRepository.findByToken(response.getRefreshToken());
        assertTrue(savedToken.isPresent());
        assertThat(savedToken.get().getExpiryDate()).isAfter(Instant.now());
    }
}
