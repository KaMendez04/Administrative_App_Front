import apiConfig from "./apiConfig";

export const forgotPasswordService = {
  async requestReset(email: string): Promise<{ ok: boolean; status: number; message?: string }> {
    try {
      const res = await apiConfig.patch("/auth/request-reset-password", { email });
      return { ok: true, status: res.status };
    } catch (err: any) {
      const status = err?.response?.status ?? 500;
      const message = err?.response?.data?.message ?? err?.message;
      return { ok: false, status, message };
    }
  },
};
