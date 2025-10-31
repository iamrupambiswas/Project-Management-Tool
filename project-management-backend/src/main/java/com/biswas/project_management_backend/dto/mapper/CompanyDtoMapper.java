package com.biswas.project_management_backend.dto.mapper;

import com.biswas.project_management_backend.dto.CompanyDto;
import com.biswas.project_management_backend.model.Company;
import org.springframework.stereotype.Component;

@Component
public class CompanyDtoMapper implements DtoMapper<Company, CompanyDto> {

    @Override
    public CompanyDto toDto(Company company) {
        if (company == null) return null;

        CompanyDto dto = new CompanyDto();
        dto.setId(company.getId());
        dto.setName(company.getName());
        dto.setDomain(company.getDomain());
        dto.setJoinCode(company.getJoinCode());
        return dto;
    }

    @Override
    public Company toEntity(CompanyDto dto) {
        if (dto == null) return null;

        Company company = new Company();
        company.setId(dto.getId());
        company.setName(dto.getName());
        company.setDomain(dto.getDomain());
        company.setJoinCode(dto.getJoinCode());
        return company;
    }
}
