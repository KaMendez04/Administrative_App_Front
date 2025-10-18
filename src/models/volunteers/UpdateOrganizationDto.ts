// ============= DTO PARA ACTUALIZAR ORGANIZACIÓN =============
export interface UpdateOrganizacionValues {
  numeroVoluntarios?: number;
  direccion?: string;
  telefono?: string;
  email?: string;
}

export interface UpdateRepresentanteValues {
  cargo?: string;
  nombre?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
}