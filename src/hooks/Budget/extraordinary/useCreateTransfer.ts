import { useState } from "react";
import { createTransfer } from "../../../services/Budget/extraordinary/TransferService";
import type { CreateTransferDto, TransferResponseDto } from "../../../models/Budget/extraordinary/transactions";

export function useCreateTransfer() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  async function submit(dto: CreateTransferDto): Promise<TransferResponseDto> {
    setLoading(true);
    setError(null);
    try {
      return await createTransfer(dto);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Error creating transfer");
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { submit, loading, error };
}
