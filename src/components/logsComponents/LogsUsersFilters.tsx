import { Filter, Search } from "lucide-react"
import { BirthDatePicker } from "@/components/ui/birthDayPicker"
import { CustomSelect } from "../CustomSelect"

export interface LogsUsersFiltersValue {
  search: string
  actionType: string
  from: string
  to: string
}

interface LogsUsersFiltersProps {
  value: LogsUsersFiltersValue
  onChange: (value: LogsUsersFiltersValue) => void
  onClear: () => void
}

const ACTION_OPTIONS = [
  { value: "ALL", label: "Todas las acciones" },
  { value: "USER_CREATED", label: "Creación" },
  { value: "USER_UPDATED", label: "Actualización" },
  { value: "USER_DELETED", label: "Eliminación" },
  { value: "USER_ACTIVATED", label: "Activación" },
  { value: "USER_DEACTIVATED", label: "Desactivación" },
  { value: "USER_PASSWORD_CHANGED", label: "Cambio de contraseña" },
  { value: "USER_EMAIL_CHANGE_REQUESTED", label: "Solicitud cambio correo" },
  { value: "USER_EMAIL_CHANGE_CONFIRMED", label: "Confirmación cambio correo" },
]

const labelClass = "mb-1.5 block text-[11px] font-semibold text-[#556B2F] uppercase tracking-wide"

export function LogsUsersFilters({ value, onChange, onClear }: LogsUsersFiltersProps) {
  return (
    <div className="rounded-3xl border border-[#E6E1D6] bg-[#FAF9F5] shadow-sm overflow-hidden">
      <div className="border-b border-[#E6E1D6] bg-white/60 px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#E6EDC8] text-[#5B732E]">
            <Filter className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#374321]">Filtros</h2>
            <p className="text-xs text-[#556B2F]">Refina la búsqueda de registros de usuarios.</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <label className={labelClass}>Buscar</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#708C3E]" />
              <input
                value={value.search}
                onChange={(e) => onChange({ ...value, search: e.target.value })}
                placeholder="Buscar por usuario, acción o descripción..."
                className="w-full rounded-xl border border-[#DCD6C9] bg-white py-3 pl-10 pr-3 text-sm text-[#33361D] placeholder:text-gray-400 outline-none transition focus:border-[#708C3E] focus:ring-2 focus:ring-[#708C3E]/20"
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <label className={labelClass}>Acción</label>
            <CustomSelect
              value={value.actionType}
              onChange={(actionType) => onChange({ ...value, actionType: String(actionType) })}
              options={ACTION_OPTIONS}
              placeholder="Acción"
              buttonClassName="rounded-xl border-[#DCD6C9] min-h-[46px]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_auto]">
          <div>
            <label className={labelClass}>Desde</label>
            <BirthDatePicker
              value={value.from}
              onChange={(from) => onChange({ ...value, from })}
              placeholder="Fecha inicial"
              helperText=""
              triggerClassName="h-11 rounded-xl border-[#DCD6C9] bg-white"
            />
          </div>
          <div>
            <label className={labelClass}>Hasta</label>
            <BirthDatePicker
              value={value.to}
              onChange={(to) => onChange({ ...value, to })}
              placeholder="Fecha final"
              helperText=""
              triggerClassName="h-11 rounded-xl border-[#DCD6C9] bg-white"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={onClear}
              className="inline-flex h-11 w-full items-center justify-center rounded-xl border-2 border-[#5B732E] bg-white px-5 text-sm font-semibold text-[#5B732E] transition hover:bg-[#EAEFE0] lg:w-auto"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}