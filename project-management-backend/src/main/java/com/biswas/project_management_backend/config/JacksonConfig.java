package com.biswas.project_management_backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();

        // Handle lazy-loaded entities (Hibernate)
        mapper.registerModule(new Hibernate6Module());

        // Handle Java 8 date/time types like LocalDate, LocalDateTime, etc.
        mapper.registerModule(new JavaTimeModule());

        return mapper;
    }
}