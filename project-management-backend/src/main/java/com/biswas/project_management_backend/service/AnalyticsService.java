package com.biswas.project_management_backend.service;

import com.biswas.project_management_backend.dto.AdminAnalyticsDto;
import com.biswas.project_management_backend.dto.UserAnalyticsDto;
import com.biswas.project_management_backend.model.User;
import com.biswas.project_management_backend.model.enm.ProjectStatus;
import com.biswas.project_management_backend.model.enm.TaskStatus;
import com.biswas.project_management_backend.repository.ProjectRepository;
import com.biswas.project_management_backend.repository.TaskRepository;
import com.biswas.project_management_backend.repository.TeamRepository;
import com.biswas.project_management_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public interface AnalyticsService {
    AdminAnalyticsDto getAnalyticsSummary(Long companyId, String dateFrom, String dateTo);
    UserAnalyticsDto getUserAnalytics(String userEmail, Long companyId);
}
