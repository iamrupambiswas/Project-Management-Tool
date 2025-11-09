package com.biswas.project_management_backend.service;

public interface AuthService {

    boolean changePassword(String username, String oldPassword, String newPassword);
}
