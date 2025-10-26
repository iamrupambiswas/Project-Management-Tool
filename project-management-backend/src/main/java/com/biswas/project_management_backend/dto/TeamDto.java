package com.biswas.project_management_backend.dto;

import lombok.*;

import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamDto {
    private Long id;
    private String name;
    private String description;
    private List<String> members;
    private Long companyId;
}
