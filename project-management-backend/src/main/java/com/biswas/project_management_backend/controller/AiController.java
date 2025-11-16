package com.biswas.project_management_backend.controller;

import com.biswas.project_management_backend.dto.AiElaborationResponseDto;
import com.biswas.project_management_backend.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @GetMapping("/elaborate/{taskId}")
    public ResponseEntity<AiElaborationResponseDto> elaborateTask(@PathVariable Long taskId) {
        return ResponseEntity.ok(aiService.elaborateTask(taskId));
    }

}
