package com.biswas.project_management_backend.service.impl;

import com.biswas.project_management_backend.dto.AiElaborationResponseDto;
import com.biswas.project_management_backend.model.Task;
import com.biswas.project_management_backend.repository.TaskRepository;
import com.biswas.project_management_backend.service.AiService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiServiceImpl implements AiService {
    private final ChatClient chatClient;
    private final TaskRepository taskRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public AiElaborationResponseDto elaborateTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        String prompt = String.format("""
            You are an expert AI project assistant.
            Elaborate the following task clearly and list 3-6 actionable steps.

            Project Name: %s
            Project Description: %s

            Task Title: %s
            Task Description: %s
            """,
                task.getProject().getName(),
                task.getProject().getDescription(),
                task.getTitle(),
                task.getDescription()
        );

        log.info("🧠 Sending AI prompt:\n{}", prompt);

        String aiResponse = chatClient.prompt()
                .user(prompt)
                .call()
                .content();

        log.info("🤖 Received AI response:\n{}", aiResponse);

        try {
            if (aiResponse.trim().startsWith("{")) {
                return objectMapper.readValue(aiResponse, AiElaborationResponseDto.class);
            }
        } catch (Exception e) {
            log.error("❌ Failed to parse AI JSON: {}", e.getMessage());
        }

        AiElaborationResponseDto fallback = new AiElaborationResponseDto();
        fallback.setElaboratedTask(aiResponse);
        fallback.setSteps(List.of());
        return fallback;
    }

    @Override
    public AiElaborationResponseDto mockElaborateTask(Long taskId) {
        // Fetch task
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        try {
            // Simulate 5-second delay
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // Mock AI response
        AiElaborationResponseDto mockResponse = new AiElaborationResponseDto();
        mockResponse.setElaboratedTask(
                String.format("""
                        This task focuses on building the backend API for project management. 
                        It will ensure proper CRUD operations, validation, and error handling 
                        for a seamless developer experience.
                        """
                )
        );
        mockResponse.setSteps(List.of(
                "Design database schema and entity relationships.",
                "Implement JPA repository and service methods.",
                "Create DTOs for request and response validation.",
                "Develop REST endpoints for CRUD operations.",
                "Add exception handling and integration tests."
        ));

        return mockResponse;
    }
}
