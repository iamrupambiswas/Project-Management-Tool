package com.biswas.project_management_backend.dto.mapper;

public interface DtoMapper<E, D> {
    D toDto(E entity);
    E toEntity(D dto);
}
