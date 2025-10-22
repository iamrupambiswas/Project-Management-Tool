package com.biswas.project_management_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterCompanyRequestDto {
    private String companyName;
    private String domain;
    private AdminDto admin;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdminDto {
        private String name;
        private String email;
        private String password;
    }
}
