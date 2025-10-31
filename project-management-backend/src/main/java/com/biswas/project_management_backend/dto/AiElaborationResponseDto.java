package com.biswas.project_management_backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class AiElaborationResponseDto {
    private String elaboratedTask;
    private List<String> steps;
}
