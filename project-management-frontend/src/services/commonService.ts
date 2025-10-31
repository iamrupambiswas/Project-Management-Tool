import { UserDto } from "../@api/models";
import api from "./api";

export const uploadProfileImage = async (file: File): Promise<UserDto> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/common/upload-profile-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (err) {
    console.error("Error uploading the image:", err);
    throw err;
  }
};

export const deleteProfileImage = async (): Promise<string> => {
  try {
    const res = await api.delete("/common/delete-profile-image");
    return res.data;
  } catch (err) {
    console.error("Error deleting the image:", err);
    throw err;
  }
};
