package com.biswas.project_management_backend.config;

import com.biswas.project_management_backend.model.Role;
import com.biswas.project_management_backend.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.findByName("ROLE_USER").isEmpty()) {
                roleRepository.save(Role.builder().name("ROLE_USER").build());
            }
            if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
                roleRepository.save(Role.builder().name("ROLE_ADMIN").build());
            }
            if (roleRepository.findByName("ROLE_PM").isEmpty()) {
                roleRepository.save(Role.builder().name("ROLE_PM").build());
            }
        };
    }
}

