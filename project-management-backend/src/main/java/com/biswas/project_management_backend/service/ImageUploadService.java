package com.biswas.project_management_backend.service;

import com.biswas.project_management_backend.model.Image;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ImageUploadService {
    Image uploadCompressedImage(MultipartFile file) throws IOException;
    void deleteImage(String publicId);
}
