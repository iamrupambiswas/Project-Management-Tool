package com.biswas.project_management_backend.service;

import com.biswas.project_management_backend.dto.CompanyDto;
import com.biswas.project_management_backend.dto.mapper.CompanyDtoMapper;
import com.biswas.project_management_backend.model.Company;
import com.biswas.project_management_backend.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyDto getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + id));
        return CompanyDtoMapper.toDTO(company);
    }
}