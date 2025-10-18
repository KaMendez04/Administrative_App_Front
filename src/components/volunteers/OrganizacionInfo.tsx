import type { Organizacion } from "../../schemas/volunteerSchemas";

interface OrganizacionInfoProps {
  organizacion: Organizacion;
}

export function OrganizacionInfo({ organizacion }: OrganizacionInfoProps) {
  return (
    <>
      {/* Datos de la Organización */}
      <div>
        <h4 className="text-lg font-bold text-[#33361D] mb-3">
          Datos de la Organización
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-[#F8F9F3] p-4">
            <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
              Nombre
            </div>
            <div className="text-base text-[#33361D] font-medium">
              {organizacion.nombre}
            </div>
          </div>
          <div className="rounded-xl bg-[#F8F9F3] p-4">
            <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
              Cédula Jurídica
            </div>
            <div className="text-base text-[#33361D] font-medium">
              {organizacion.cedulaJuridica}
            </div>
          </div>
          <div className="rounded-xl bg-[#F8F9F3] p-4">
            <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
              Email
            </div>
            <div className="text-base text-[#33361D] font-medium">
              {organizacion.email}
            </div>
          </div>
          <div className="rounded-xl bg-[#F8F9F3] p-4">
            <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
              Teléfono
            </div>
            <div className="text-base text-[#33361D] font-medium">
              {organizacion.telefono}
            </div>
          </div>
          <div className="rounded-xl bg-[#F8F9F3] p-4 md:col-span-2">
            <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
              Dirección
            </div>
            <div className="text-base text-[#33361D] font-medium">
              {organizacion.direccion}
            </div>
          </div>
          <div className="rounded-xl bg-[#F8F9F3] p-4">
            <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
              Tipo de Organización
            </div>
            <div className="text-base text-[#33361D] font-medium">
              {organizacion.tipoOrganizacion}
            </div>
          </div>
          <div className="rounded-xl bg-[#FEF6E0] p-4">
            <div className="text-xs font-bold text-[#C19A3D] tracking-wider uppercase mb-1">
              Número de Voluntarios
            </div>
            <div className="text-base text-[#33361D] font-medium">
              {organizacion.numeroVoluntarios}
            </div>
          </div>
        </div>
      </div>

      {/* Representantes */}
      {organizacion.representantes && organizacion.representantes.length > 0 && (
        <div>
          <h4 className="text-lg font-bold text-[#33361D] mb-3">
            Representantes
          </h4>
          <div className="space-y-3">
            {organizacion.representantes.map((rep) => (
              <div
                key={rep.idRepresentante}
                className="rounded-xl bg-[#F8F9F3] p-4 border-l-4 border-[#5B732E]"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
                      Nombre
                    </div>
                    <div className="text-sm text-[#33361D] font-medium">
                      {rep.persona.nombre} {rep.persona.apellido1}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
                      Cargo
                    </div>
                    <div className="text-sm text-[#33361D] font-medium">
                      {rep.cargo}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">
                      Email
                    </div>
                    <div className="text-sm text-[#33361D] font-medium">
                      {rep.persona.email}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Razones Sociales */}
      {organizacion.razonesSociales &&
        organizacion.razonesSociales.length > 0 && (
          <div>
            <h4 className="text-lg font-bold text-[#33361D] mb-3">
              Razones Sociales
            </h4>
            <div className="flex flex-wrap gap-2">
              {organizacion.razonesSociales.map((razon) => (
                <span
                  key={razon.idRazonSocial}
                  className="px-4 py-2 bg-[#E6EDC8] text-[#5A7018] rounded-xl text-sm font-semibold"
                >
                  {razon.razonSocial}
                </span>
              ))}
            </div>
          </div>
        )}
    </>
  );
}