import { useState } from "react";
import { 
  Home, User, CheckCircle2, XCircle, Zap, Droplets, Sprout, 
  Warehouse, Fence, Wrench, Route, Store, BarChart3
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
      <div className="text-xs font-semibold text-[#556B2F] uppercase mb-1">{label}</div>
      <div className="text-sm text-[#33361D]">{value ?? "—"}</div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-[#EAEFE0] text-[#33361D]">
      {children}
    </span>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border border-[#EAEFE0] bg-white px-4 py-3">{children}</div>;
}

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-[#F8F9F3] p-5 border border-[#EAEFE0]">
      <h4 className="text-sm font-bold text-[#5B732E] uppercase mb-4 flex items-center gap-2">
        <Icon className="w-4 h-4" />
        {title}
      </h4>
      {children}
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
    // ---- Apartos (vienen en tabla equipos) ----
  const normalizarNombre = (v: any) => String(v ?? "").trim().toLowerCase();

  const apartosEquipos = (Array.isArray(otrosEquipos) ? otrosEquipos : []).filter(
    (oe: any) => normalizarNombre(oe?.nombreEquipo) === "apartos"
  );

  const otrosEquiposSinApartos = (Array.isArray(otrosEquipos) ? otrosEquipos : []).filter(
    (oe: any) => normalizarNombre(oe?.nombreEquipo) !== "apartos"
  );

  const totalApartos = apartosEquipos.reduce((acc: number, oe: any) => {
    const n = Number(oe?.cantidad);
    return acc + (Number.isFinite(n) ? n : 0);
  }, 0);


  return (
    <details
      className="mb-4 rounded-2xl border-2 border-[#EAEFE0] overflow-hidden bg-white"
      open={isFirst}
      onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="bg-[#EAEFE0] px-6 py-4 cursor-pointer font-bold text-[#33361D] hover:bg-[#d9e4cd] transition flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Home className="w-5 h-5 text-[#5B732E]" />
          <span>
            {finca?.nombre ?? "Finca sin nombre"} • {finca?.areaHa ?? "0"} ha
            {finca?.geografia && ` • ${finca.geografia.provincia}, ${finca.geografia.canton}`}
          </span>
        </div>
      </summary>

      <div className="p-6 bg-white space-y-6">
        {isLoadingAny && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#5B732E] border-t-transparent"></div>
            <p className="mt-3 text-sm text-[#556B2F]">Cargando información...</p>
          </div>
        )}

        {!isLoadingAny && (
          <>
            {/* Información General */}
            <Section title="Información General" icon={Home}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Nombre" value={finca?.nombre} />
                <Field label="Área (ha)" value={finca?.areaHa} />
                <Field label="Número de plano" value={finca?.numeroPlano} />
                <div>
                  <div className="text-xs font-semibold text-[#556B2F] uppercase mb-1">Propietario</div>
                  <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold ${
                    esPropietarioReal ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
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
                <div className="mt-4 pt-4 border-t border-[#EAEFE0]">
                  <Field 
                    label="Ubicación" 
                    value={`${finca.geografia.provincia}, ${finca.geografia.canton}, ${finca.geografia.distrito}${finca.geografia.caserio ? `, ${finca.geografia.caserio}` : ''}`}
                  />
                </div>
              )}
            </Section>

            {/* Propietario diferente */}
            {tienePropietarioDiferente && (
              <div className="rounded-xl bg-[#FEF6E0] p-5 border border-[#F5E6C3]">
                <h4 className="text-sm font-bold text-[#C19A3D] uppercase mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Datos del Propietario
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Corriente */}
            {corriente && (corriente?.publica || corriente?.privada) && (
              <Section title="Corriente Eléctrica" icon={Zap}>
                <div className="flex flex-wrap gap-2">
                  {corriente?.publica && <Chip>Pública</Chip>}
                  {corriente?.privada && <Chip>Privada</Chip>}
                </div>
              </Section>
            )}

            {/* Registros Productivos */}
            {registrosProductivos && (
              <Section title="Registros Productivos" icon={BarChart3}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-semibold text-[#556B2F] uppercase mb-1">Reproductivos</div>
                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold ${
                      registrosProductivos?.reproductivos ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'
                    }`}>
                      {registrosProductivos?.reproductivos ? (
                        <><CheckCircle2 className="w-3.5 h-3.5" /> Sí</>
                      ) : (
                        <><XCircle className="w-3.5 h-3.5" /> No</>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#556B2F] uppercase mb-1">Costos productivos</div>
                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold ${
                      registrosProductivos?.costosProductivos ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'
                    }`}>
                      {registrosProductivos?.costosProductivos ? (
                        <><CheckCircle2 className="w-3.5 h-3.5" /> Sí</>
                      ) : (
                        <><XCircle className="w-3.5 h-3.5" /> No</>
                      )}
                    </div>
                  </div>
                </div>
              </Section>
            )}

           {/* Hato */}
          {hato && (
            <Section title="Hato" icon={Sprout}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Tipo de explotación" value={hato?.tipoExplotacion} />
                  <Field label="Total de ganado" value={hato?.totalGanado} />
                  <Field label="Raza predominante" value={hato?.razaPredominante} />
                </div>
                {hato?.animales && Array.isArray(hato.animales) && hato.animales.length > 0 && (
                  <div className="pt-4 border-t border-[#EAEFE0]">
                    <div className="text-xs font-semibold text-[#556B2F] uppercase mb-3">Detalle de animales</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {hato.animales.map((a: any, i: number) => (
                        <ListItem key={a?.idAnimal ?? i}>
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-[#33361D]">{a?.nombre ?? "—"}</span>
                            <span className="text-[#556B2F]">Edad Aproximada: {a?.edad ?? "—"} • Cantidad: {a?.cantidad ?? "—"}</span>
                          </div>
                        </ListItem>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Section>
          )}

            {/* Forrajes */}
            {Array.isArray(forrajes) && forrajes.length > 0 && (
              <Section title="Forrajes" icon={Sprout}>
                <div className="space-y-2">
                  {forrajes.map((f: any, i: number) => (
                    <ListItem key={f?.idForraje ?? i}>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <Field label="Tipo" value={f?.tipoForraje} />
                        <Field label="Variedad" value={f?.variedad} />
                        <Field label="Hectáreas" value={f?.hectareas} />
                        <Field label="Utilización" value={f?.utilizacion} />
                      </div>
                    </ListItem>
                  ))}
                </div>
              </Section>
            )}

            {/* Actividades */}
            {Array.isArray(actividades) && actividades.length > 0 && (
              <Section title="Actividades Agropecuarias" icon={Sprout}>
                <div className="flex flex-wrap gap-2">
                  {actividades.map((ac: any, i: number) => (
                    <Chip key={ac?.idActividad ?? i}>{ac?.nombre ?? "—"}</Chip>
                  ))}
                </div>
              </Section>
            )}

            {/* Fuentes de agua */}
            {Array.isArray(fuentesAgua) && fuentesAgua.length > 0 && (
              <Section title="Fuentes de Agua" icon={Droplets}>
                <div className="flex flex-wrap gap-2">
                  {fuentesAgua.map((fa: any, i: number) => (
                    <Chip key={fa?.idFuenteAgua ?? i}>{fa?.nombre ?? "—"}</Chip>
                  ))}
                </div>
              </Section>
            )}

            {/* Métodos de riego */}
            {Array.isArray(metodosRiego) && metodosRiego.length > 0 && (
              <Section title="Métodos de Riego" icon={Droplets}>
                <div className="flex flex-wrap gap-2">
                  {metodosRiego.map((mr: any, i: number) => (
                    <Chip key={mr?.idMetodoRiego ?? i}>{mr?.nombre ?? "—"}</Chip>
                  ))}
                </div>
              </Section>
            )}

            {/* Infraestructura */}
            {infraestructura && (
              <Section title="Infraestructura de Producción" icon={Warehouse}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Aparatos" value={infraestructura?.numeroAparatos} />
                  <Field label="Bebederos" value={infraestructura?.numeroBebederos} />
                  <Field label="Saleros" value={infraestructura?.numeroSaleros} />
                </div>
              </Section>
            )}

            {/* Tipos de cerca */}
            {Array.isArray(tiposCerca) && tiposCerca.length > 0 && (
              <Section title="Tipos de Cerca" icon={Fence}>
                <div className="flex flex-wrap gap-2">
                  {tiposCerca.map((tc: any, i: number) => {
                    const chips: string[] = [];''
                    if (tc?.tipoCerca?.alambrePuas) chips.push("Alambre de puas");
                    if (tc?.tipoCerca?.viva) chips.push("Viva");
                    if (tc?.tipoCerca?.electrica) chips.push("Eléctrica");
                    if (tc?.tipoCerca?.pMuerto) chips.push("P. muerto");
                    return chips.map((c, j) => <Chip key={`${i}-${j}`}>{c}</Chip>);
                  })}
                </div>
              </Section>
            )}

            {/* Infraestructuras disponibles */}
            {Array.isArray(infraestructuras) && infraestructuras.length > 0 && (
              <Section title="Infraestructuras Disponibles" icon={Warehouse}>
                <div className="space-y-2">
                  {infraestructuras.map((il: any, i: number) => (
                    <ListItem key={il?.id ?? i}>
                      <div className="text-sm font-medium text-[#33361D]">{il?.infraestructura?.nombre ?? "—"}</div>
                      {il?.infraestructura?.descripcion && (
                        <div className="text-xs text-[#556B2F] mt-1">{il.infraestructura.descripcion}</div>
                      )}
                    </ListItem>
                  ))}
                </div>
              </Section>
            )}

                        {/* Cantidad de apartos (viene en Otros Equipos pero separado) */}
            {Array.isArray(otrosEquipos) && apartosEquipos.length > 0 && (
              <Section title="Cantidad de apartos de la finca" icon={Fence}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <ListItem>
                    <Field label="" value={totalApartos} />
                  </ListItem>
                </div>
              </Section>
            )}

            {/* Otros equipos (sin apartos) */}
            {Array.isArray(otrosEquiposSinApartos) && otrosEquiposSinApartos.length > 0 && (
              <Section title="Otros Equipos" icon={Wrench}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {otrosEquiposSinApartos.map((oe: any, i: number) => (
                    <ListItem key={oe?.idFincaOtroEquipo ?? i}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-[#33361D]">{oe?.nombreEquipo ?? "—"}</span>
                        <span className="text-[#556B2F]">Cant: {oe?.cantidad ?? "—"}</span>
                      </div>
                    </ListItem>
                  ))}
                </div>
              </Section>
            )}

            {/* Vías de acceso */}
            {Array.isArray(accesos) && accesos.length > 0 && (
              <Section title="Vías de Acceso" icon={Route}>
                <div className="flex flex-wrap gap-2">
                  {accesos.map((acceso: any, i: number) => (
                    <Chip key={acceso?.idAcceso ?? i}>{acceso?.nombre ?? "—"}</Chip>
                  ))}
                </div>
              </Section>
            )}

            {/* Canales */}
            {Array.isArray(canales) && canales.length > 0 && (
              <Section title="Canales de Comercialización" icon={Store}>
                <div className="flex flex-wrap gap-2">
                  {canales.map((canal: any, i: number) => (
                    <Chip key={canal?.idCanal ?? i}>{canal?.nombre ?? "—"}</Chip>
                  ))}
                </div>
              </Section>
            )}
          </>
        )}
      </div>
    </details>
  );
}