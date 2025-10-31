import { AiElaborationResponseDto } from "../@api";
import api from "./api";


export const elaborateTask = async (taskId: number): Promise<AiElaborationResponseDto> => {
  try {
    const response = await api.get(`/ai/elaborate/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("Error elaborating task:", error);
    return {
      elaboratedTask: "⚠️ Failed to elaborate task. Please try again.",
      steps: [],
    };
  }
};
