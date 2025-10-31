package com.biswas.project_management_backend.service;

import com.biswas.project_management_backend.model.Image;
import com.biswas.project_management_backend.repository.ImageRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Map;

@Service
public class ImageUploadService {

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private ImageRepository imageRepository;

    public Image uploadCompressedImage(MultipartFile file) throws IOException {

        // Step 1: Validate image file
        BufferedImage bufferedImage = ImageIO.read(file.getInputStream());
        if (bufferedImage == null) {
            throw new IOException("Invalid image file");
        }

        // Step 2: Determine file extension
        String originalFilename = file.getOriginalFilename();
        String extension = "jpg";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
        }

        // Step 3: Compress image
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Thumbnails.of(bufferedImage)
                .scale(1.0)
                .outputQuality(0.6)
                .outputFormat(extension.equals("png") ? "png" : "jpg")
                .toOutputStream(outputStream);

        // Step 4: Upload to Cloudinary
        Map uploadResult = cloudinary.uploader().upload(
                outputStream.toByteArray(),
                ObjectUtils.asMap(
                        "folder", "user_profiles",
                        "resource_type", "image"
                )
        );

        // Step 5: Create Image entity
        Image image = Image.builder()
                .url((String) uploadResult.get("secure_url"))
                .publicId((String) uploadResult.get("public_id"))
                .format((String) uploadResult.get("format"))
                .size(file.getSize())
                .build();

        // Step 6: Save in DB
        return imageRepository.save(image);
    }

    public void deleteImage(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("invalidate", true));
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete image from Cloudinary", e);
        }
    }
}