package com.biswas.project_management_backend.dto;

import com.biswas.project_management_backend.model.User;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDto {
    private String token;
    private UserDto user;
}
