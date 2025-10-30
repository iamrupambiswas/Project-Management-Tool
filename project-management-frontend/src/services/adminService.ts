import api from "./api";

export async function uploadUserCSV(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/admin/users/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}
