import apiConfig from "../apiConfig";


export const fyApi = {
  list: async () => {
    const res = await apiConfig.get("/fiscal-year");
    return res.data;
  },

  create: async (p: { year: number; start_date: string; end_date: string; is_active?: boolean }) => {
    const res = await apiConfig.post("/fiscal-year", p);
    return res.data;
  },

  patch: async (id: number, p: any) => {
    const res = await apiConfig.patch(`/fiscal-year/${id}`, p);
    return res.data;
  },
};
