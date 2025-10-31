package com.biswas.project_management_backend.repository;

import com.biswas.project_management_backend.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, Long> {

}
