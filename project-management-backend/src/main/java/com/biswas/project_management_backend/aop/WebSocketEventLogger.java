package com.biswas.project_management_backend.aop;

//package com.biswas.project_management_backend.websocket;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.simp.broker.BrokerAvailabilityEvent;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.*;

@Slf4j
@Component
public class WebSocketEventLogger {

    @EventListener
    public void handleBrokerAvailable(BrokerAvailabilityEvent event) {
        log.info("🔗 WebSocket Broker available: {}", event.isBrokerAvailable());
    }

    @EventListener
    public void handleSessionConnect(SessionConnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        log.info("🟢 WebSocket CONNECT: sessionId={} user={}", accessor.getSessionId(), accessor.getUser());
    }

    @EventListener
    public void handleSessionConnected(SessionConnectedEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        log.info("✅ WebSocket CONNECTED: sessionId={} user={}", accessor.getSessionId(), accessor.getUser());
    }

    @EventListener
    public void handleSessionSubscribe(SessionSubscribeEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        log.info("📩 WebSocket SUBSCRIBE: sessionId={} destination={}", accessor.getSessionId(), accessor.getDestination());
    }

    @EventListener
    public void handleSessionUnsubscribe(SessionUnsubscribeEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        log.info("📭 WebSocket UNSUBSCRIBE: sessionId={} destination={}", accessor.getSessionId(), accessor.getDestination());
    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        log.info("🔴 WebSocket DISCONNECT: sessionId={} closeStatus={}", event.getSessionId(), event.getCloseStatus());
    }
}

