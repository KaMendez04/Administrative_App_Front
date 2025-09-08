import { useMemo, useState } from "react";
import type { CategoryPayload } from "../../../models/Categories/categories";
import { createCategory } from "../../../services/Budget/Categories/categoriesService";

// límites locales al hook (en lugar de constants/)
const MAX_NAME = 50;
const MAX_DESC = 250;

type Options = {
  initialValue?: Partial<CategoryPayload>;
  onSuccess?: (created: unknown) => void;
  onCancel?: () => void;
};

export function useCategoryForm({ initialValue, onSuccess, onCancel }: Options = {}) {
  const [name, setName] = useState(initialValue?.name ?? "");
  const [description, setDescription] = useState(initialValue?.description ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nameCount = useMemo(() => name.length, [name]);
  const descCount = useMemo(() => description.length, [description]);

  const resetError = () => setError(null);

  const extractErrorMessage = (err: any): string => {
    // Soporte para Axios: error.response?.data?.message o texto plano
    if (err?.isRateLimited) {
      return err?.message || "Demasiados intentos. Intenta nuevamente más tarde.";
    }
    const axiosMsg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message;
    return axiosMsg || "Error al registrar la categoría";
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return; // evita doble submit
    resetError();

    const payload: CategoryPayload = {
      name: name.trim(),
      description: description.trim(),
    };

    try {
      setLoading(true);
      const created = await createCategory(payload);
      onSuccess?.(created);
    } catch (err: any) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return {
    // estado
    name,
    setName,
    description,
    setDescription,
    nameCount,
    descCount,
    // flags
    loading,
    error,
    // límites
    MAX_NAME,
    MAX_DESC,
    // acciones
    submit,
    cancel: onCancel,
  };
}
