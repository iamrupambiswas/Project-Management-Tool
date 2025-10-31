package com.biswas.project_management_backend.service;

import com.biswas.project_management_backend.dto.UserDto;
import com.biswas.project_management_backend.dto.mapper.UserDtoMapper;
import com.biswas.project_management_backend.model.Image;
import com.biswas.project_management_backend.model.User;
import com.biswas.project_management_backend.repository.ImageRepository;
import com.biswas.project_management_backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CommonService {

    private final ImageUploadService imageUploadService;
    private final UserRepository userRepository;
    private final ImageRepository imageRepository;
    private final UserDtoMapper userDtoMapper;

    public UserDto uploadOrUpdateProfileImage(MultipartFile file, Authentication authentication) {
        if (file.isEmpty()) {
            throw new RuntimeException("File cannot be empty");
        }

        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {

            if (user.getProfileImage() != null) {
                Image oldImage = user.getProfileImage();

                user.setProfileImage(null);
                userRepository.save(user);

                imageUploadService.deleteImage(oldImage.getPublicId());
                imageRepository.delete(oldImage);
            }

            Image newImage = imageUploadService.uploadCompressedImage(file);
            imageRepository.save(newImage);

            user.setProfileImage(newImage);
            User updatedUser = userRepository.save(user);
            UserDto userDto = userDtoMapper.toDto(updatedUser);

            return userDto;

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }

    @Transactional
    public void deleteProfileImage(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByUsername(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Image existingImage = user.getProfileImage();
        if (existingImage == null) {
            throw new RuntimeException("No profile image to delete");
        }

        user.setProfileImage(null);
        userRepository.save(user);

        imageUploadService.deleteImage(existingImage.getPublicId());
        imageRepository.deleteById(existingImage.getId());
    }

}