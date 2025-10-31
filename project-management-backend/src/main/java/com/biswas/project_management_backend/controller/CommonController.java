package com.biswas.project_management_backend.controller;

import com.biswas.project_management_backend.service.CommonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/common")
@RequiredArgsConstructor
public class CommonController {

    private final CommonService commonService;

    @PostMapping("/upload-profile-image")
    public ResponseEntity<?> uploadProfileImage(
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {
        return ResponseEntity.ok(commonService.uploadOrUpdateProfileImage(file, authentication));
    }

    @DeleteMapping("/delete-profile-image")
    public ResponseEntity<String> deleteProfileImage(Authentication authentication) {
        commonService.deleteProfileImage(authentication);
        return ResponseEntity.ok("Profile image deleted successfully");
    }
}
