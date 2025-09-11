import api from "./api";

export const getTeams = async () => {
  const res = await api.get("/teams");
  return res.data;
};
