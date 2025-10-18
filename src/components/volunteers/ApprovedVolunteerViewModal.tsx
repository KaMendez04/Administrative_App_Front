import { useState } from "react";
import type { VoluntarioIndividual, Organizacion } from "../../schemas/volunteerSchemas";
import { AreasInteresTab } from "../volunteers/AreasInteresTab";
import { DisponibilidadTab } from "../volunteers/DisponibilidadTab";

interface ApprovedVolunteerViewModalProps {
  open: boolean;
  onClose: () => void;
  data: VoluntarioIndividual | Organizacion | null;
  tipo: "INDIVIDUAL" | "ORGANIZACION";
  isLoading: boolean;
}

type Tab = "info" | "areas" | "disponibilidad";

export function ApprovedVolunteerViewModal({
  open,
  onClose,
  data,
  tipo,
  isLoading,
}: ApprovedVolunteerViewModalProps) {
  const [selectedTab, setSelectedTab] = useState<Tab>("info");

  if (!open) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading || !data) {
    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#5B732E]"></div>
            <p className="mt-4 text-[#556B2F] font-medium">
              Cargando detalles...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isIndividual = tipo === "INDIVIDUAL";
  const voluntario = isIndividual ? (data as VoluntarioIndividual) : null;
  const organizacion = !isIndividual ? (data as Organizacion) : null;

  const hasAreasInteres =
    (isIndividual && voluntario?.areasInteres && voluntario.areasInteres.length > 0) ||
    (!isIndividual && organizacion?.areasInteres && organizacion.areasInteres.length > 0);

  const hasDisponibilidad =
    (isIndividual && voluntario?.disponibilidades && voluntario.disponibilidades.length > 0) ||
    (!isIndividual && organizacion?.disponibilidades && organizacion.disponibilidades.length > 0);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F8F9F3] to-[#EAEFE0] p-6 border-b border-[#EAEFE0] rounded-t-2xl">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-[#33361D]">
                Detalles del {isIndividual ? "Voluntario" : "Organización"}
              </h3>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-lg text-sm font-bold ${
                    data.isActive
                      ? "bg-[#E6EDC8] text-[#5A7018]"
                      : "bg-[#F7E9E6] text-[#8C3A33]"
                  }`}
                >
                  {data.isActive ? "ACTIVO" : "INACTIVO"}
                </span>

                <span
                  className={`px-3 py-1 rounded-lg text-sm font-bold ${
                    isIndividual
                      ? "bg-[#D4E8E0] text-[#2D5F4F]"
                      : "bg-[#F5E6C5] text-[#8B6C2E]"
                  }`}
                >
                  {tipo}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#EAEFE0] px-6 bg-white">
          <button
            onClick={() => setSelectedTab("info")}
            className={`px-4 py-3 font-semibold text-sm transition ${
              selectedTab === "info"
                ? "text-[#5B732E] border-b-2 border-[#5B732E]"
                : "text-[#33361D] hover:text-[#5B732E]"
            }`}
          >
            Información General
          </button>
          {hasAreasInteres && (
            <button
              onClick={() => setSelectedTab("areas")}
              className={`px-4 py-3 font-semibold text-sm transition ${
                selectedTab === "areas"
                  ? "text-[#5B732E] border-b-2 border-[#5B732E]"
                  : "text-[#33361D] hover:text-[#5B732E]"
              }`}
            >
              Áreas de Interés
            </button>
          )}
          {hasDisponibilidad && (
            <button
              onClick={() => setSelectedTab("disponibilidad")}
              className={`px-4 py-3 font-semibold text-sm transition ${
                selectedTab === "disponibilidad"
                  ? "text-[#5B732E] border-b-2 border-[#5B732E]"
                  : "text-[#33361D] hover:text-[#5B732E]"
              }`}
            >
              Disponibilidad
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB: INFORMACIÓN GENERAL */}
          {selectedTab === "info" && (
            <div className="space-y-6">
              {/* Voluntario Individual */}
              {isIndividual && voluntario && (
                <div className="space-y-6">
                  {/* Información Personal */}
                  <section className="bg-[#F8F9F3] rounded-xl p-5">
                    <h4 className="text-lg font-bold text-[#33361D] mb-4">
                      Información Personal
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
                          Cédula
                        </div>
                        <div className="text-base text-[#33361D] font-medium">
                          {voluntario.persona.cedula}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
                          Nombre Completo
                        </div>
                        <div className="text-base text-[#33361D] font-medium">
                          {voluntario.persona.nombre} {voluntario.persona.apellido1}{" "}
                          {voluntario.persona.apellido2}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
                          Teléfono
                        </div>
                        <div className="text-base text-[#33361D] font-medium">
                          {voluntario.persona.telefono}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
                          Correo
                        </div>
                        <div className="text-base text-[#33361D] font-medium">
                          {voluntario.persona.email}
                        </div>
                      </div>
                      {voluntario.persona.fechaNacimiento && (
                        <div>
                          <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
                            Fecha de Nacimiento
                          </div>
                          <div className="text-base text-[#33361D] font-medium">
                            {formatDate(voluntario.persona.fechaNacimiento)}
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
                          Nacionalidad
                        </div>
                        <div className="text-base text-[#33361D] font-medium">
                          {voluntario.nacionalidad}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Información del Voluntariado */}
                  <section className="bg-[#F8F9F3] rounded-xl p-5">
                    <h4 className="text-lg font-bold text-[#33361D] mb-4">
                      Información del Voluntariado
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
                          Motivación
                        </div>
                        <div className="text-base text-[#33361D]">
                          {voluntario.motivacion}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
                          Habilidades
                        </div>
                        <div className="text-base text-[#33361D]">
                          {voluntario.habilidades}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
                          Experiencia
                        </div>
                        <div className="text-base text-[#33361D]">
                          {voluntario.experiencia}
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {/* Organización */}
              {!isIndividual && organizacion && (
                <div className="space-y-6">
                  {/* Información de la Organización */}
                  <section className="bg-[#F8F9F3] rounded-xl p-5">
                    <h4 className="text-lg font-bold text-[#33361D] mb-4">
                      Información de la Organización
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs font-bold text-[#8C3A33] tracking-wider uppercase mb-1">
                          Cédula Jurídica
                        </div>
                        <div className="text-base text-[#33361D] font-medium">
                          {organizacion.cedulaJuridica}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#8C3A33] tracking-wider uppercase mb-1">
                          Nombre
                        </div>
                        <div className="text-base text-[#33361D] font-medium">
                          {organizacion.nombre}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#8C3A33] tracking-wider uppercase mb-1">
                          Teléfono
                        </div>
                        <div className="text-base text-[#33361D] font-medium">
                          {organizacion.telefono}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#8C3A33] tracking-wider uppercase mb-1">
                          Correo
                        </div>
                        <div className="text-base text-[#33361D] font-medium">
                          {organizacion.email}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#8C3A33] tracking-wider uppercase mb-1">
                          Tipo de Organización
                        </div>
                        <div className="text-base text-[#33361D] font-medium">
                          {organizacion.tipoOrganizacion}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#8C3A33] tracking-wider uppercase mb-1">
                          Número de Voluntarios
                        </div>
                        <div className="text-base text-[#33361D] font-medium">
                          {organizacion.numeroVoluntarios}
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-xs font-bold text-[#8C3A33] tracking-wider uppercase mb-1">
                          Dirección
                        </div>
                        <div className="text-base text-[#33361D] font-medium">
                          {organizacion.direccion}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Representantes */}
                  {organizacion.representantes && organizacion.representantes.length > 0 && (
                    <section className="bg-[#F8F9F3] rounded-xl p-5">
                      <h4 className="text-lg font-bold text-[#33361D] mb-4">
                        Representantes
                      </h4>
                      <div className="space-y-4">
                        {organizacion.representantes.map((rep) => (
                          <div
                            key={rep.idRepresentante}
                            className="border-l-4 border-[#8C3A33] pl-4"
                          >
                            <div className="font-semibold text-[#33361D]">
                              {rep.persona.nombre} {rep.persona.apellido1}{" "}
                              {rep.persona.apellido2}
                            </div>
                            <div className="text-sm text-[#556B2F]">
                              {rep.cargo}
                            </div>
                            <div className="text-sm text-[#33361D]">
                              {rep.persona.email} | {rep.persona.telefono}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Razones Sociales */}
                  {organizacion.razonesSociales && organizacion.razonesSociales.length > 0 && (
                    <section className="bg-[#F8F9F3] rounded-xl p-5">
                      <h4 className="text-lg font-bold text-[#33361D] mb-4">
                        Razones Sociales
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {organizacion.razonesSociales.map((razon) => (
                          <span
                            key={razon.idRazonSocial}
                            className="px-3 py-1 bg-white rounded-lg text-sm text-[#33361D] border border-[#EAEFE0]"
                          >
                            {razon.razonSocial}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB: ÁREAS DE INTERÉS */}
          {selectedTab === "areas" && (
            <AreasInteresTab
              areasInteres={
                isIndividual
                  ? voluntario?.areasInteres || []
                  : organizacion?.areasInteres || []
              }
              tipoSolicitante={tipo}
            />
          )}

          {/* TAB: DISPONIBILIDAD */}
          {selectedTab === "disponibilidad" && (
            <DisponibilidadTab
              disponibilidades={
                isIndividual
                  ? voluntario?.disponibilidades || []
                  : organizacion?.disponibilidades || []
              }
              tipoSolicitante={tipo}
            />
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#EAEFE0] px-6 py-4 bg-[#F8F9F3]">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-[#5B732E] text-white font-semibold hover:bg-[#556B2F] transition shadow-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}