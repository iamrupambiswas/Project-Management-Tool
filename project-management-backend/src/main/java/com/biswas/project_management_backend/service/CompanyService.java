package com.biswas.project_management_backend.service;

import com.biswas.project_management_backend.dto.CompanyDto;

public interface CompanyService {
    CompanyDto getCompanyById(Long id);
}