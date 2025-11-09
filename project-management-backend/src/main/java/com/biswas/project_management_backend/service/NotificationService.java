package com.biswas.project_management_backend.service;

import com.biswas.project_management_backend.model.Notification;
import com.biswas.project_management_backend.model.User;
import com.biswas.project_management_backend.model.enm.NotificationType;

import java.util.List;

public interface NotificationService {

    Notification createNotification(User recipient, String message, NotificationType type, Long relatedEntityId);
    List<Notification> getNotificationsByEmail(String email);
    void markAsRead(Long notificationId);
    void markAllAsRead(Long userId);
}