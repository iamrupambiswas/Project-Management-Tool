package com.biswas.project_management_backend.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequestDto {
    private String username;
    private String email;
    private String password;
}
