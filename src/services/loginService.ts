import apiConfig from "../apiConfig/apiConfig";
import type { LoginPayload, LoginResponse } from "../models/LoginType";

export async function postLogin(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await apiConfig.post<LoginResponse>("/auth/login", payload);
  return data;
}
