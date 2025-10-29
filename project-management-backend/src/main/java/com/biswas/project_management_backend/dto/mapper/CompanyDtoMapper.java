package com.biswas.project_management_backend.dto.mapper;

import com.biswas.project_management_backend.dto.CompanyDto;
import com.biswas.project_management_backend.model.Company;

public class CompanyDtoMapper {

    public static CompanyDto toDTO(Company company) {
        if (company == null) {
            return null;
        }
        return CompanyDto.builder()
                .id(company.getId())
                .name(company.getName())
                .domain(company.getDomain())
                .joinCode(company.getJoinCode())
                .build();
    }

    public static Company toEntity(CompanyDto dto) {
        if (dto == null) {
            return null;
        }
        return Company.builder()
                .id(dto.getId())
                .name(dto.getName())
                .domain(dto.getDomain())
                .joinCode(dto.getJoinCode())
                .build();
    }
}
