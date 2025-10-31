package com.biswas.project_management_backend.service;

import com.biswas.project_management_backend.dto.CompanyDto;
import com.biswas.project_management_backend.dto.mapper.CompanyDtoMapper;
import com.biswas.project_management_backend.model.Company;
import com.biswas.project_management_backend.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CompanyService {

    @Autowired
    private final CompanyRepository companyRepository;

    @Autowired
    private final CompanyDtoMapper companyDtoMapper;

    public CompanyDto getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + id));
        return companyDtoMapper.toDto(company);
    }
}