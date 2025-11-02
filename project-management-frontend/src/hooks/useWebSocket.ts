import { useEffect } from "react";
import {
  connectWebSocket,
  disconnectWebSocket,
  addMessageListener,
  removeMessageListener,
} from "../services/webSocketService";
import { toast } from "react-toastify";

// helper to play a short notification sound
const playNotificationSound = () => {
  const audio = new Audio(`${window.location.origin}/notification.wav`);
  audio.volume = 0.7;
  audio.play().catch((err) => console.warn("🔇 Audio playback blocked:", err));
};

export const useWebSocket = (
  userId: number,
  onNotification?: (data: any) => void
) => {
  useEffect(() => {
    if (!userId) return;

    const handleMessage = (rawMsg: string) => {
      try {
        const data = JSON.parse(rawMsg);
        const messageText = data.message || "New notification";

        toast.info(messageText, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });

        playNotificationSound();

        // ✅ Pass full notification data (not just text)
        if (onNotification) {
          onNotification(data);
        }
      } catch (error) {
        console.error("❌ Failed to parse WebSocket message:", rawMsg, error);
        toast.error("Received invalid notification");
      }
    };

    connectWebSocket(userId);
    addMessageListener(handleMessage);

    return () => {
      removeMessageListener(handleMessage);
      disconnectWebSocket();
    };
  }, [userId, onNotification]);
};
