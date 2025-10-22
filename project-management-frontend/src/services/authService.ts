import api from "./api";
// Import generated DTOs
import {
  LoginRequestDto,
  RegisterRequestDto,
  RegisterCompanyRequestDto,
  AuthResponseDto,
} from "../@api/models";

// ---------------- LOGIN ----------------
export const login = async (data: LoginRequestDto): Promise<AuthResponseDto> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

// ---------------- REGISTER USER ----------------
export const register = async (data: RegisterRequestDto): Promise<AuthResponseDto> => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

// ---------------- REGISTER COMPANY WITH ADMIN ----------------
export const registerCompany = async (
  data: RegisterCompanyRequestDto
): Promise<AuthResponseDto> => {
  const response = await api.post("/auth/register/company", data);
  return response.data;
};
