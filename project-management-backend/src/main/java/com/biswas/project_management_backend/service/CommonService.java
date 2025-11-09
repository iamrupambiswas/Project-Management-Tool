package com.biswas.project_management_backend.service;

import com.biswas.project_management_backend.dto.UserDto;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

public interface CommonService {

    UserDto uploadOrUpdateProfileImage(MultipartFile file, Authentication authentication);
    void deleteProfileImage(Authentication authentication);

}