package com.biswas.project_management_backend.service.impl;

import com.biswas.project_management_backend.model.Image;
import com.biswas.project_management_backend.repository.ImageRepository;
import com.biswas.project_management_backend.service.ImageUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@Profile({"prod", "docker"})
public class MockImageUploadServiceImpl implements ImageUploadService {

    @Autowired
    private ImageRepository imageRepository;

    @Override
    public Image uploadCompressedImage(MultipartFile file) throws IOException {
        // Generate a fake URL and publicId
        String fakeUrl = "https://example.com/mock-images/" + UUID.randomUUID() + ".jpg";
        String fakePublicId = "mock_" + UUID.randomUUID();

        Image image = Image.builder()
                .url(fakeUrl)
                .publicId(fakePublicId)
                .format("jpg")
                .size(file.getSize())
                .build();

        return imageRepository.save(image);
    }

    @Override
    public void deleteImage(String publicId) {
        System.out.println("Mock delete image: " + publicId);
    }
}
