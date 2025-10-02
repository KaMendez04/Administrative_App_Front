export interface Extraordinary {
  id: number;
  name: string;
  amount: string; // TypeORM decimal suele venir como string
  used: string;
  date?: string | null;
}

export const initialState = {
  name: "",
  amount: "",
  date: null,
};
