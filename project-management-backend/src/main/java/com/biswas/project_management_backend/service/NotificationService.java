package com.biswas.project_management_backend.service;

import com.biswas.project_management_backend.model.*;
import com.biswas.project_management_backend.model.enm.NotificationType;
import com.biswas.project_management_backend.repository.NotificationRepository;
import com.biswas.project_management_backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    UserRepository userRepository;

    public Notification createNotification(User recipient, String message, NotificationType type, Long relatedEntityId) {
        Notification notification = Notification.builder()
                .recipient(recipient)
                .message(message)
                .type(type)
                .relatedEntityId(relatedEntityId)
                .build();

        notificationRepository.save(notification);

        try {
            messagingTemplate.convertAndSend("/topic/notifications/" + recipient.getId(), notification);
        } catch (Exception e) {
            log.error("❌ Failed to send notification to user {}: {}", recipient.getId(), e.getMessage());
        }

        return notification;
    }

    public List<Notification> getNotificationsByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(user.getId());
    }

    public void markAsRead(Long notificationId) {
//        Notification n = notificationRepository.findById(notificationId).orElseThrow();
//        n.setRead(true);
//        notificationRepository.save(n);

        notificationRepository.deleteById(notificationId);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
//        List<Notification> unread = notificationRepository.findByRecipientIdAndIsReadFalse(userId);
//        if (!unread.isEmpty()) {
//            unread.forEach(n -> n.setRead(true));
//            notificationRepository.saveAll(unread);
//        }

        notificationRepository.deleteAllByRecipientId(userId);
    }
}