package com.biswas.project_management_backend.controller;

import com.biswas.project_management_backend.dto.AdminAnalyticsDto;
import com.biswas.project_management_backend.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/analytics/summary")
    public ResponseEntity<AdminAnalyticsDto> getAnalyticsSummary(
            @RequestParam Long companyId,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo) {
        AdminAnalyticsDto summary = analyticsService.getAnalyticsSummary(companyId, dateFrom, dateTo);
        return ResponseEntity.ok(summary);
    }
}
