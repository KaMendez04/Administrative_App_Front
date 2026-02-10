import type { User } from "@/models/LoginType";

export type RouterContext = {
  auth: {
    user: User | null;
    token: string | null;
  };
};
