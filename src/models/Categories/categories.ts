
export type CategoryPayload = {
  name: string;
  description: string;
};

/** Representación completa de una categoría en el backend */
export type Category = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};
