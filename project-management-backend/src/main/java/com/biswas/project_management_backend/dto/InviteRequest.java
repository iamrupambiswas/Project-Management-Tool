package com.biswas.project_management_backend.dto;

import lombok.Data;

@Data
public class InviteRequest {
    private String email;
    private String role;
}
