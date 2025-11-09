package com.biswas.project_management_backend.service.impl;


import com.biswas.project_management_backend.dto.CompanyDto;
import com.biswas.project_management_backend.dto.mapper.CompanyDtoMapper;
import com.biswas.project_management_backend.model.Company;
import com.biswas.project_management_backend.repository.CompanyRepository;
import com.biswas.project_management_backend.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Profile("local")
public class CompanyServiceImpl implements CompanyService {
    private final CompanyRepository companyRepository;
    private final CompanyDtoMapper companyDtoMapper;

    @Override
    public CompanyDto getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + id));
        return companyDtoMapper.toDto(company);
    }
}
