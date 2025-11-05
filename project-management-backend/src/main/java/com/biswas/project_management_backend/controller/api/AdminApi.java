package com.biswas.project_management_backend.controller.api;

import com.biswas.project_management_backend.dto.AdminAnalyticsDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RequestMapping("/api/admin")
public interface AdminApi {

    @GetMapping("/analytics/summary")
    ResponseEntity<AdminAnalyticsDto> getAnalyticsSummary(
            @RequestParam Long companyId,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo
    );

    @PostMapping("/users/upload")
    ResponseEntity<String> uploadUserCSV(
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    );
}
