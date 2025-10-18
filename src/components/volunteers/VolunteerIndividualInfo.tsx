import type { VoluntarioIndividual } from "../../schemas/volunteerSchemas";

interface VolunteerIndividualInfoProps {
  voluntario: VoluntarioIndividual;
  formatDate: (dateString: string) => string;
}

export function VolunteerIndividualInfo({
  voluntario,
  formatDate,
}: VolunteerIndividualInfoProps) {
  return (
    <>
      {/* Información Personal */}
      <div>
        <h4 className="text-lg font-bold text-[#33361D] mb-3">
          Información Personal
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-[#F8F9F3] p-4">
            <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
              Nombre Completo
            </div>
            <div className="text-base text-[#33361D] font-medium">
              {voluntario.persona.nombre} {voluntario.persona.apellido1}{" "}
              {voluntario.persona.apellido2}
            </div>
          </div>
          <div className="rounded-xl bg-[#F8F9F3] p-4">
            <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
              Cédula
            </div>
            <div className="text-base text-[#33361D] font-medium">
              {voluntario.persona.cedula}
            </div>
          </div>
          <div className="rounded-xl bg-[#F8F9F3] p-4">
            <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
              Email
            </div>
            <div className="text-base text-[#33361D] font-medium">
              {voluntario.persona.email}
            </div>
          </div>
          <div className="rounded-xl bg-[#F8F9F3] p-4">
            <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
              Teléfono
            </div>
            <div className="text-base text-[#33361D] font-medium">
              {voluntario.persona.telefono}
            </div>
          </div>
          <div className="rounded-xl bg-[#F8F9F3] p-4">
            <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
              Nacionalidad
            </div>
            <div className="text-base text-[#33361D] font-medium">
              {voluntario.nacionalidad}
            </div>
          </div>
          {voluntario.persona.fechaNacimiento && (
            <div className="rounded-xl bg-[#F8F9F3] p-4">
              <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
                Fecha de Nacimiento
              </div>
              <div className="text-base text-[#33361D] font-medium">
                {formatDate(voluntario.persona.fechaNacimiento)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Perfil del Voluntario */}
      <div>
        <h4 className="text-lg font-bold text-[#33361D] mb-3">
          Perfil del Voluntario
        </h4>
        <div className="space-y-4">
          <div className="rounded-xl bg-[#F8F9F3] p-4">
            <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
              Motivación
            </div>
            <div className="text-base text-[#33361D] font-medium">
              {voluntario.motivacion}
            </div>
          </div>
          <div className="rounded-xl bg-[#F8F9F3] p-4">
            <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
              Habilidades
            </div>
            <div className="text-base text-[#33361D] font-medium">
              {voluntario.habilidades}
            </div>
          </div>
          <div className="rounded-xl bg-[#F8F9F3] p-4">
            <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
              Experiencia
            </div>
            <div className="text-base text-[#33361D] font-medium">
              {voluntario.experiencia}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}