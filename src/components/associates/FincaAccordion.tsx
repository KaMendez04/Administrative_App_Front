import { useState } from "react";
import {
  useFincaHato,
  useFincaForrajes,
  useFincaFuentesAgua,
  useFincaMetodosRiego,
  useFincaActividades,
  useFincaInfraestructura,
  useFincaTiposCerca,
  useFincaInfraestructuras,
  useFincaOtrosEquipos,
  useFincaRegistrosProductivos,
} from "../../hooks/associates";

type Props = {
  finca: any;
  isFirst: boolean;
  esPropietario: boolean;
};

export function FincaAccordion({ finca, isFirst, esPropietario }: Props) {
  const [isOpen, setIsOpen] = useState(isFirst);

  const { data: hato, isLoading: loadingHato } = useFincaHato(isOpen ? finca?.idFinca : null);
  const { data: forrajes = [], isLoading: loadingForrajes } = useFincaForrajes(isOpen ? finca?.idFinca : null);
  const { data: fuentesAgua = [], isLoading: loadingFuentes } = useFincaFuentesAgua(isOpen ? finca?.idFinca : null);
  const { data: metodosRiego = [], isLoading: loadingMetodos } = useFincaMetodosRiego(isOpen ? finca?.idFinca : null);
  const { data: actividades = [], isLoading: loadingActividades } = useFincaActividades(isOpen ? finca?.idFinca : null);
  const { data: infraestructura, isLoading: loadingInfra } = useFincaInfraestructura(isOpen ? finca?.idFinca : null);
  const { data: tiposCerca = [], isLoading: loadingTipos } = useFincaTiposCerca(isOpen ? finca?.idFinca : null);
  const { data: infraestructuras = [], isLoading: loadingInfraestructuras } = useFincaInfraestructuras(isOpen ? finca?.idFinca : null);
  const { data: otrosEquipos = [], isLoading: loadingEquipos } = useFincaOtrosEquipos(isOpen ? finca?.idFinca : null);
  const { data: registrosProductivos, isLoading: loadingRegistros } = useFincaRegistrosProductivos(isOpen ? finca?.idFinca : null);

  const isLoadingAny = 
    loadingHato || loadingForrajes || loadingFuentes || loadingMetodos || 
    loadingActividades || loadingInfra || loadingTipos || loadingInfraestructuras || 
    loadingEquipos || loadingRegistros;

  return (
    <details
      className="mb-4 rounded-xl border-2 border-[#EAEFE0] overflow-hidden"
      open={isFirst}
      onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="bg-[#EAEFE0] px-4 py-3 cursor-pointer font-bold text-[#33361D] hover:bg-[#d9e4cd] transition">
        {finca?.nombre ?? "Finca sin nombre"} - {finca?.areaHa ?? "0"} ha
        {finca?.geografia && ` - ${finca.geografia.provincia}, ${finca.geografia.canton}`}
      </summary>

      <div className="p-4 bg-white space-y-4">
        {isLoadingAny && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#5B732E]"></div>
            <p className="mt-2 text-sm text-[#556B2F]">Cargando detalles...</p>
          </div>
        )}

        {!isLoadingAny && (
          <>
            {/* Datos básicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-[#F8F9F3] p-4">
                <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">Nombre</div>
                <div className="text-base text-[#33361D] font-medium">{finca?.nombre ?? "—"}</div>
              </div>
              <div className="rounded-xl bg-[#F8F9F3] p-4">
                <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">Área (ha)</div>
                <div className="text-base text-[#33361D] font-medium">{finca?.areaHa ?? "—"}</div>
              </div>
              <div className="rounded-xl bg-[#F8F9F3] p-4">
                <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">Número de Plano</div>
                <div className="text-base text-[#33361D] font-medium">{finca?.numeroPlano ?? "—"}</div>
              </div>
              {finca?.geografia && (
                <div className="rounded-xl bg-[#F8F9F3] p-4">
                  <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">Ubicación</div>
                  <div className="text-base text-[#33361D] font-medium">
                    {finca.geografia.provincia}, {finca.geografia.canton}, {finca.geografia.distrito}
                    {finca.geografia.caserio && `, ${finca.geografia.caserio}`}
                  </div>
                </div>
              )}
            </div>

            {/* Propietario */}
            {finca?.propietario && !esPropietario && (
              <div>
                <h5 className="text-base font-bold text-[#33361D] mb-2">Propietario de esta finca</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-[#FEF6E0] p-4">
                    <div className="text-xs font-bold text-[#C19A3D] tracking-wider uppercase mb-1">Nombre completo</div>
                    <div className="text-base text-[#33361D] font-medium">
                      {finca.propietario?.persona ? 
                        `${finca.propietario.persona.nombre ?? ""} ${finca.propietario.persona.apellido1 ?? ""} ${finca.propietario.persona.apellido2 ?? ""}`.trim() 
                        : "—"}
                    </div>
                  </div>
                  <div className="rounded-xl bg-[#FEF6E0] p-4">
                    <div className="text-xs font-bold text-[#C19A3D] tracking-wider uppercase mb-1">Cédula</div>
                    <div className="text-base text-[#33361D] font-medium">
                      {finca.propietario?.persona?.cedula ?? "—"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Registros Productivos */}
            {registrosProductivos && (
              <div>
                <h5 className="text-base font-bold text-[#33361D] mb-2">Registros Productivos</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-[#F8F9F3] p-4">
                    <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">Reproductivos</div>
                    <div className="text-base text-[#33361D] font-medium">
                      {registrosProductivos?.reproductivos ? "Sí" : "No"}
                    </div>
                  </div>
                  <div className="rounded-xl bg-[#F8F9F3] p-4">
                    <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">Costos productivos</div>
                    <div className="text-base text-[#33361D] font-medium">
                      {registrosProductivos?.costosProductivos ? "Sí" : "No"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Hato */}
            {hato && (
              <div>
                <h5 className="text-base font-bold text-[#33361D] mb-2">Hato</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-[#F8F9F3] p-4">
                    <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">Tipo de explotación</div>
                    <div className="text-base text-[#33361D] font-medium">
                      {hato?.tipoExplotacion ?? "—"}
                    </div>
                  </div>
                  <div className="rounded-xl bg-[#F8F9F3] p-4">
                    <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">Total de ganado</div>
                    <div className="text-base text-[#33361D] font-medium">
                      {hato?.totalGanado ?? "—"}
                    </div>
                  </div>
                  <div className="rounded-xl bg-[#F8F9F3] p-4 md:col-span-2">
                    <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">Raza predominante</div>
                    <div className="text-base text-[#33361D] font-medium">
                      {hato?.razaPredominante ?? "—"}
                    </div>
                  </div>

                  {hato?.animales && Array.isArray(hato.animales) && hato.animales.length > 0 && (
                    <div className="rounded-xl bg-[#F8F9F3] p-4 md:col-span-2">
                      <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-2">Animales</div>
                      <div className="space-y-2">
                        {hato.animales.map((a: any, i: number) => (
                          <div key={a?.idAnimal ?? i} className="flex flex-wrap items-center justify-between gap-2 rounded border border-[#EAEFE0] bg-white px-3 py-2">
                            <div className="text-sm font-semibold text-[#33361D]">{a?.nombre ?? "—"}</div>
                            <div className="text-xs text-[#33361D]">Edad: {a?.edad ?? "—"}</div>
                            <div className="text-xs text-[#33361D]">Cantidad: {a?.cantidad ?? "—"}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Forrajes */}
            {Array.isArray(forrajes) && forrajes.length > 0 && (
              <div>
                <h5 className="text-base font-bold text-[#33361D] mb-2">Forrajes</h5>
                <div className="space-y-2">
                  {forrajes.map((f: any, i: number) => (
                    <div key={f?.idForraje ?? i} className="rounded-xl bg-[#F8F9F3] p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">Tipo</div>
                          <div className="text-base text-[#33361D] font-medium">{f?.tipoForraje ?? "—"}</div>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">Variedad</div>
                          <div className="text-base text-[#33361D] font-medium">{f?.variedad ?? "—"}</div>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">Hectáreas</div>
                          <div className="text-base text-[#33361D] font-medium">{f?.hectareas ?? "—"}</div>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">Utilización</div>
                          <div className="text-base text-[#33361D] font-medium">{f?.utilizacion ?? "—"}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fuentes de Agua */}
            {Array.isArray(fuentesAgua) && fuentesAgua.length > 0 && (
              <div>
                <h5 className="text-base font-bold text-[#33361D] mb-2">Fuentes de agua</h5>
                <div className="rounded-xl bg-[#F8F9F3] p-4">
                  <div className="space-y-2">
                    {fuentesAgua.map((fa: any, i: number) => (
                      <div key={fa?.idFuenteAgua ?? i} className="rounded border border-[#EAEFE0] bg-white px-3 py-2">
                        <div className="text-sm font-semibold text-[#33361D]">{fa?.nombre ?? "—"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Métodos de Riego */}
            {Array.isArray(metodosRiego) && metodosRiego.length > 0 && (
              <div>
                <h5 className="text-base font-bold text-[#33361D] mb-2">Métodos de riego</h5>
                <div className="rounded-xl bg-[#F8F9F3] p-4">
                  <div className="space-y-2">
                    {metodosRiego.map((mr: any, i: number) => (
                      <div key={mr?.idMetodoRiego ?? i} className="rounded border border-[#EAEFE0] bg-white px-3 py-2">
                        <div className="text-sm font-semibold text-[#33361D]">{mr?.nombre ?? "—"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Actividades */}
            {Array.isArray(actividades) && actividades.length > 0 && (
              <div>
                <h5 className="text-base font-bold text-[#33361D] mb-2">Actividades Agropecuarias</h5>
                <div className="rounded-xl bg-[#F8F9F3] p-4">
                  <div className="space-y-2">
                    {actividades.map((ac: any, i: number) => (
                      <div key={ac?.idActividad ?? i} className="rounded border border-[#EAEFE0] bg-white px-3 py-2">
                        <div className="text-sm font-semibold text-[#33361D]">{ac?.nombre ?? "—"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Infraestructura */}
            {infraestructura && (
              <div>
                <h5 className="text-base font-bold text-[#33361D] mb-2">Infraestructura de Producción</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-xl bg-[#F8F9F3] p-4">
                    <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">Número de aparatos</div>
                    <div className="text-base text-[#33361D] font-medium">{infraestructura?.numeroAparatos ?? "—"}</div>
                  </div>
                  <div className="rounded-xl bg-[#F8F9F3] p-4">
                    <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">Número de bebederos</div>
                    <div className="text-base text-[#33361D] font-medium">{infraestructura?.numeroBebederos ?? "—"}</div>
                  </div>
                  <div className="rounded-xl bg-[#F8F9F3] p-4">
                    <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase mb-1">Número de saleros</div>
                    <div className="text-base text-[#33361D] font-medium">{infraestructura?.numeroSaleros ?? "—"}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tipos de Cerca */}
            {Array.isArray(tiposCerca) && tiposCerca.length > 0 && (
              <div>
                <h5 className="text-base font-bold text-[#33361D] mb-2">Tipos de Cerca</h5>
                <div className="rounded-xl bg-[#F8F9F3] p-4">
                  <div className="flex flex-wrap gap-2">
                    {tiposCerca.map((tc: any, i: number) => {
                      const chips: string[] = [];
                      if (tc?.tipoCerca?.viva) chips.push("Viva");
                      if (tc?.tipoCerca?.electrica) chips.push("Eléctrica");
                      if (tc?.tipoCerca?.pMuerto) chips.push("P. muerto");
                      
                      if (chips.length === 0) return null;
                      
                      return (
                        <div key={tc?.id ?? i} className="flex flex-wrap gap-2">
                          {chips.map((c, j) => (
                            <span key={`${i}-${j}`} className="px-3 py-1 text-sm font-semibold rounded-lg bg-white border-2 border-[#EAEFE0] text-[#33361D]">
                              {c}
                            </span>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Infraestructuras Disponibles */}
            {Array.isArray(infraestructuras) && infraestructuras.length > 0 && (
              <div>
                <h5 className="text-base font-bold text-[#33361D] mb-2">Infraestructuras Disponibles</h5>
                <div className="rounded-xl bg-[#F8F9F3] p-4">
                  <div className="space-y-2">
                    {infraestructuras.map((il: any, i: number) => (
                      <div key={il?.id ?? i} className="rounded border border-[#EAEFE0] bg-white p-3">
                        <div className="text-sm font-semibold text-[#33361D]">
                          {il?.infraestructura?.nombre ?? "—"}
                        </div>
                        {il?.infraestructura?.descripcion && (
                          <div className="text-xs text-[#33361D] mt-1">
                            {il.infraestructura.descripcion}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Otros Equipos */}
            {Array.isArray(otrosEquipos) && otrosEquipos.length > 0 && (
              <div>
                <h5 className="text-base font-bold text-[#33361D] mb-2">Otros Equipos</h5>
                <div className="rounded-xl bg-[#F8F9F3] p-4">
                  <div className="space-y-2">
                    {otrosEquipos.map((oe: any, i: number) => (
                      <div key={oe?.idFincaOtroEquipo ?? i} className="flex items-center justify-between gap-2 rounded border border-[#EAEFE0] bg-white px-3 py-2">
                        <div className="text-sm font-semibold text-[#33361D]">
                          {oe?.nombreEquipo ?? "—"}
                        </div>
                        <div className="text-xs text-[#33361D]">
                          Cantidad: {oe?.cantidad ?? "—"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </details>
  );
}