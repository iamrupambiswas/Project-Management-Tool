package com.biswas.project_management_backend.service;

import org.springframework.web.multipart.MultipartFile;

public interface AdminService {
    String saveUsersFromCsv(MultipartFile file, String adminIdentifier) throws Exception;
}
