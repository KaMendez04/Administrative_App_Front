import { useState } from "react";
import { 
  Home, User, CheckCircle2
} from "lucide-react";
import {
  useFincaHato, useFincaForrajes, useFincaFuentesAgua, useFincaMetodosRiego,
  useFincaActividades, useFincaInfraestructura, useFincaTiposCerca,
  useFincaInfraestructuras, useFincaOtrosEquipos, useFincaRegistrosProductivos,
  useFincaAccesos, useFincaCanales,
} from "../../hooks/associates";

type Props = {
  finca: any;
  isFirst: boolean;
  esPropietario: boolean;
};

function Field({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div className="text-xs font-medium text-gray-500 uppercase mb-1">{label}</div>
      <div className="text-sm text-gray-900">{value ?? "—"}</div>
    </div>
  );
}



export function FincaAccordion({ finca, isFirst }: Props) {
  const [isOpen, setIsOpen] = useState(isFirst);

  const tienePropietarioDiferente = Boolean(finca?.propietario?.persona?.cedula);
  const esPropietarioReal = !tienePropietarioDiferente;

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
  const { data: accesos = [], isLoading: loadingAccesos } = useFincaAccesos(isOpen ? finca?.idFinca : null);
  const { data: canales = [], isLoading: loadingCanales } = useFincaCanales(isOpen ? finca?.idFinca : null);

  const corriente = finca?.corriente;
  const isLoadingAny = loadingHato || loadingForrajes || loadingFuentes || loadingMetodos || 
    loadingActividades || loadingInfra || loadingTipos || loadingInfraestructuras || 
    loadingEquipos || loadingRegistros || loadingAccesos || loadingCanales;

  return (
    <details
      className="mb-4 rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm"
      open={isFirst}
      onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="bg-white px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50 transition flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#E6EDC8] flex items-center justify-center">
            <Home className="w-5 h-5 text-[#6F8C1F]" />
          </div>
          <div>
            <div className="text-base font-semibold text-gray-900">
              {finca?.nombre ?? "Finca sin nombre"}
            </div>
            <div className="text-sm text-gray-500 mt-0.5">
              {finca?.areaHa ?? "0"} hectáreas
              {finca?.geografia && ` • ${finca.geografia.provincia}, ${finca.geografia.canton}`}
            </div>
          </div>
        </div>
      </summary>

      <div className="p-8 bg-gray-50">
        {isLoadingAny && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#6F8C1F] border-t-transparent"></div>
            <p className="mt-4 text-sm text-gray-600">Cargando información...</p>
          </div>
        )}

        {!isLoadingAny && (
          <div className="space-y-8">
            {/* Información General - Card completa */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h5 className="text-sm font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">INFORMACIÓN GENERAL</h5>
              <div className="grid grid-cols-4 gap-8">
                <Field label="Nombre" value={finca?.nombre} />
                <Field label="Área (ha)" value={finca?.areaHa} />
                <Field label="Número de plano" value={finca?.numeroPlano} />
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">Propietario</div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    esPropietarioReal ? 'bg-[#E6EDC8] text-[#5A7018]' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {esPropietarioReal ? (
                      <><CheckCircle2 className="w-3.5 h-3.5" /> Es el asociado</>
                    ) : (
                      <><User className="w-3.5 h-3.5" /> Diferente</>
                    )}
                  </div>
                </div>
              </div>
              {finca?.geografia && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <Field 
                    label="Ubicación completa" 
                    value={`${finca.geografia.provincia}, ${finca.geografia.canton}, ${finca.geografia.distrito}${finca.geografia.caserio ? `, ${finca.geografia.caserio}` : ''}`}
                  />
                </div>
              )}
            </div>

            {/* Propietario diferente */}
            {tienePropietarioDiferente && (
              <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
                <h5 className="text-sm font-semibold text-yellow-900 mb-5 pb-3 border-b border-yellow-200">DATOS DEL PROPIETARIO</h5>
                <div className="grid grid-cols-2 gap-8">
                  <Field 
                    label="Nombre completo" 
                    value={finca.propietario?.persona ? 
                      `${finca.propietario.persona.nombre ?? ""} ${finca.propietario.persona.apellido1 ?? ""} ${finca.propietario.persona.apellido2 ?? ""}`.trim() 
                      : "—"}
                  />
                  <Field label="Cédula" value={finca.propietario?.persona?.cedula} />
                </div>
              </div>
            )}

            {/* Grid de 2 columnas para las secciones */}
            <div className="grid grid-cols-2 gap-6">
              {/* Columna Izquierda */}
              <div className="space-y-6">
                {/* Corriente Eléctrica */}
                {corriente && (corriente?.publica || corriente?.privada) && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h5 className="text-sm font-semibold text-gray-900 mb-4">CORRIENTE ELÉCTRICA</h5>
                    <div className="flex flex-wrap gap-2">
                      {corriente?.publica && (
                        <span className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-700">
                          Pública
                        </span>
                      )}
                      {corriente?.privada && (
                        <span className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-700">
                          Privada
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Registros Productivos */}
                {registrosProductivos && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h5 className="text-sm font-semibold text-gray-900 mb-4">REGISTROS PRODUCTIVOS</h5>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Reproductivos</span>
                        <div className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          registrosProductivos?.reproductivos ? 'bg-[#E6EDC8] text-[#5A7018]' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {registrosProductivos?.reproductivos ? 'Sí' : 'No'}
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Costos productivos</span>
                        <div className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          registrosProductivos?.costosProductivos ? 'bg-[#E6EDC8] text-[#5A7018]' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {registrosProductivos?.costosProductivos ? 'Sí' : 'No'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hato */}
                {hato && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h5 className="text-sm font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">HATO</h5>
                    <div className="space-y-4">
                      <Field label="Tipo de explotación" value={hato?.tipoExplotacion} />
                      <Field label="Total de ganado" value={hato?.totalGanado} />
                      <Field label="Raza predominante" value={hato?.razaPredominante} />
                      {hato?.animales && Array.isArray(hato.animales) && hato.animales.length > 0 && (
                        <div className="pt-4 border-t border-gray-100">
                          <div className="text-xs font-medium text-gray-500 uppercase mb-3">Detalle de animales</div>
                          <div className="space-y-2">
                            {hato.animales.map((a: any, i: number) => (
                              <div key={a?.idAnimal ?? i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-900">{a?.nombre ?? "—"}</span>
                                <span className="text-sm text-gray-600">
                                  Edad: {a?.edad ?? "—"} • Cant: {a?.cantidad ?? "—"}
                                </span>
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
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h5 className="text-sm font-semibold text-gray-900 mb-4">FORRAJES</h5>
                    <div className="space-y-3">
                      {forrajes.map((f: any, i: number) => (
                        <div key={f?.idForraje ?? i} className="p-4 bg-gray-50 rounded-lg space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="font-medium text-gray-900">{f?.tipoForraje ?? "—"}</div>
                            <div className="text-sm font-semibold text-[#6F8C1F]">{f?.hectareas ?? "—"} ha</div>
                          </div>
                          <div className="text-sm text-gray-600">
                            <div>Variedad: {f?.variedad ?? "—"}</div>
                            <div>Utilización: {f?.utilizacion ?? "—"}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actividades Agropecuarias */}
                {Array.isArray(actividades) && actividades.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h5 className="text-sm font-semibold text-gray-900 mb-4">ACTIVIDADES AGROPECUARIAS</h5>
                    <div className="flex flex-wrap gap-2">
                      {actividades.map((ac: any, i: number) => (
                        <span key={ac?.idActividad ?? i} className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-700">
                          {ac?.nombre ?? "—"}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Infraestructura de Producción */}
                {infraestructura && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h5 className="text-sm font-semibold text-gray-900 mb-4">INFRAESTRUCTURA DE PRODUCCIÓN</h5>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{infraestructura?.numeroAparatos ?? 0}</div>
                        <div className="text-xs text-gray-500 mt-1">Aparatos</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{infraestructura?.numeroBebederos ?? 0}</div>
                        <div className="text-xs text-gray-500 mt-1">Bebederos</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{infraestructura?.numeroSaleros ?? 0}</div>
                        <div className="text-xs text-gray-500 mt-1">Saleros</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Columna Derecha */}
              <div className="space-y-6">
                {/* Fuentes de Agua */}
                {Array.isArray(fuentesAgua) && fuentesAgua.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h5 className="text-sm font-semibold text-gray-900 mb-4">FUENTES DE AGUA</h5>
                    <div className="flex flex-wrap gap-2">
                      {fuentesAgua.map((fa: any, i: number) => (
                        <span key={fa?.idFuenteAgua ?? i} className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-700">
                          {fa?.nombre ?? "—"}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Métodos de Riego */}
                {Array.isArray(metodosRiego) && metodosRiego.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h5 className="text-sm font-semibold text-gray-900 mb-4">MÉTODOS DE RIEGO</h5>
                    <div className="flex flex-wrap gap-2">
                      {metodosRiego.map((mr: any, i: number) => (
                        <span key={mr?.idMetodoRiego ?? i} className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-700">
                          {mr?.nombre ?? "—"}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tipos de Cerca */}
                {Array.isArray(tiposCerca) && tiposCerca.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h5 className="text-sm font-semibold text-gray-900 mb-4">TIPOS DE CERCA</h5>
                    <div className="flex flex-wrap gap-2">
                      {tiposCerca.map((tc: any, i: number) => {
                        const chips: string[] = [];
                        if (tc?.tipoCerca?.alambrePuas) chips.push("Alambre de púas");
                        if (tc?.tipoCerca?.viva) chips.push("Viva");
                        if (tc?.tipoCerca?.electrica) chips.push("Eléctrica");
                        if (tc?.tipoCerca?.pMuerto) chips.push("P. muerto");
                        return chips.map((c, j) => (
                          <span key={`${i}-${j}`} className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-700">
                            {c}
                          </span>
                        ));
                      })}
                    </div>
                  </div>
                )}

                {/* Infraestructuras Disponibles */}
                {Array.isArray(infraestructuras) && infraestructuras.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h5 className="text-sm font-semibold text-gray-900 mb-4">INFRAESTRUCTURAS DISPONIBLES</h5>
                    <div className="space-y-3">
                      {infraestructuras.map((il: any, i: number) => (
                        <div key={il?.id ?? i} className="p-3 bg-gray-50 rounded-lg">
                          <div className="font-medium text-gray-900 text-sm">{il?.infraestructura?.nombre ?? "—"}</div>
                          {il?.infraestructura?.descripcion && (
                            <div className="text-xs text-gray-600 mt-1">{il.infraestructura.descripcion}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Otros Equipos */}
                {Array.isArray(otrosEquipos) && otrosEquipos.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h5 className="text-sm font-semibold text-gray-900 mb-4">OTROS EQUIPOS</h5>
                    <div className="space-y-2">
                      {otrosEquipos.map((oe: any, i: number) => (
                        <div key={oe?.idFincaOtroEquipo ?? i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-900">{oe?.nombreEquipo ?? "—"}</span>
                          <span className="text-sm text-gray-600 font-semibold">×{oe?.cantidad ?? "—"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vías de Acceso */}
                {Array.isArray(accesos) && accesos.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h5 className="text-sm font-semibold text-gray-900 mb-4">VÍAS DE ACCESO</h5>
                    <div className="flex flex-wrap gap-2">
                      {accesos.map((acceso: any, i: number) => (
                        <span key={acceso?.idAcceso ?? i} className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-700">
                          {acceso?.nombre ?? "—"}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Canales de Comercialización */}
                {Array.isArray(canales) && canales.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h5 className="text-sm font-semibold text-gray-900 mb-4">CANALES DE COMERCIALIZACIÓN</h5>
                    <div className="flex flex-wrap gap-2">
                      {canales.map((canal: any, i: number) => (
                        <span key={canal?.idCanal ?? i} className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-700">
                          {canal?.nombre ?? "—"}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          )}
        </div>
      </details>
    );
  }