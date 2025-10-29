import { CompanyDto } from "../@api";
import api from "./api";

export const getCompany = async (id: number): Promise<CompanyDto> => {
  try {
    const res = await api.get(`/company/${id}`);
    console.log("Company API Response:", res.data);
    return res.data;
  } catch (err) {
    console.error("Error fetching company:", err);
    throw err;
  }
};