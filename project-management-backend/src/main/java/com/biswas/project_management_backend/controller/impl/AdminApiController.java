package com.biswas.project_management_backend.controller.impl;

import com.biswas.project_management_backend.controller.api.AdminApi;
import com.biswas.project_management_backend.dto.AdminAnalyticsDto;
import com.biswas.project_management_backend.service.AdminService;
import com.biswas.project_management_backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
@RestController
@PreAuthorize("hasRole('ADMIN')")
public class AdminApiController implements AdminApi {

    private final AnalyticsService analyticsService;
    private final AdminService adminService;

    @Override
    public ResponseEntity<AdminAnalyticsDto> getAnalyticsSummary(Long companyId, String dateFrom, String dateTo) {
        AdminAnalyticsDto summary = analyticsService.getAnalyticsSummary(companyId, dateFrom, dateTo);
        return ResponseEntity.ok(summary);
    }

    @Override
    public ResponseEntity<String> uploadUserCSV(MultipartFile file, Authentication authentication) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }

            String adminIdentifier = authentication.getName();
            String message = adminService.saveUsersFromCsv(file, adminIdentifier);

            return ResponseEntity.ok(message);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}
