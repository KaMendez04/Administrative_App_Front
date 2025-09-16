import type { Extraordinary } from "../../../models/Budget/extraordinary/extraordinaryInterface";
import { allocateExtraordinary, createExtraordinary, deleteExtraordinary, listExtraordinary, remainingExtraordinary } from "../../../services/Budget/extraordinary/ExtraordinaryService";


export const useExtraordinary = {
  list: (): Promise<Extraordinary[]> => listExtraordinary(),
  create: (body: Pick<Extraordinary, "name" | "amount" | "date">) =>
    createExtraordinary(body),
  remove: (id: number) => deleteExtraordinary(id),
  allocate: (id: number, amount: number) =>
    allocateExtraordinary(id, amount),
  remaining: (id: number) => remainingExtraordinary(id),
};
