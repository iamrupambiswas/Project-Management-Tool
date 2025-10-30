package com.biswas.project_management_backend.controller;

import com.biswas.project_management_backend.dto.AdminAnalyticsDto;
import com.biswas.project_management_backend.service.AdminService;
import com.biswas.project_management_backend.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    AdminService adminService;

    @GetMapping("/analytics/summary")
    public ResponseEntity<AdminAnalyticsDto> getAnalyticsSummary(
            @RequestParam Long companyId,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo) {
        AdminAnalyticsDto summary = analyticsService.getAnalyticsSummary(companyId, dateFrom, dateTo);
        return ResponseEntity.ok(summary);
    }

    @PostMapping("/users/upload")
    public ResponseEntity<String> uploadUserCSV(@RequestParam("file") MultipartFile file, Authentication authentication) {
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
