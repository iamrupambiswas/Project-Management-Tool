package com.biswas.project_management_backend.service;

import com.biswas.project_management_backend.dto.AiElaborationResponseDto;
import com.biswas.project_management_backend.model.Task;
import com.biswas.project_management_backend.repository.TaskRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

public interface AiService {

    AiElaborationResponseDto elaborateTask(Long taskId);
    AiElaborationResponseDto mockElaborateTask(Long taskId);

}