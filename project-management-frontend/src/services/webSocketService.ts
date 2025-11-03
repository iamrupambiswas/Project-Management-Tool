// src/services/webSocketService.ts
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient: Client | null = null;
let listeners: ((msg: string) => void)[] = [];

export const connectWebSocket = (userId: number) => {
  if (stompClient && stompClient.connected) return;

  const socket = new SockJS("http://localhost:8080/ws");
  stompClient = new Client({
    webSocketFactory: () => socket as any,
    reconnectDelay: 5000,
    onConnect: () => {
      const topic = `/topic/notifications/${userId}`;
      stompClient?.subscribe(topic, (message) => {
        if (message.body) {
          listeners.forEach((cb) => cb(message.body));
        }
      });
    },
    onStompError: (frame) => {
      console.error("❌ STOMP error", frame.headers["message"]);
    },
  });

  stompClient.activate();
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
  }
};

export const addMessageListener = (callback: (msg: string) => void) => {
  listeners.push(callback);
};

export const removeMessageListener = (callback: (msg: string) => void) => {
  listeners = listeners.filter((cb) => cb !== callback);
};