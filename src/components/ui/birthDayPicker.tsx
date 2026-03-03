import { useMemo, useState, memo, useEffect, useRef } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon } from "lucide-react"
import { es } from "date-fns/locale"
import { CustomSelect } from "../CustomSelect"

interface BirthDatePickerProps {
  value?: string
  onChange: (date: string) => void

  // ✅ si lo pasas => modo "nacimiento" (limita fecha máxima)
  minAge?: number

  placeholder?: string
  error?: string
  disabled?: boolean
  className?: string

  // ✅ si lo pasas => modo "eventos" (limita fecha mínima)
  minDate?: string // ISO YYYY-MM-DD

  // ✅ si existe (aunque sea ""), NO se muestra el texto por defecto
  helperText?: string

  // ✅ para estilos del botón trigger
  triggerClassName?: string
}

function _BirthDatePicker({
  value,
  onChange,
  minAge, // <- SIN default
  placeholder = "Seleccione una fecha",
  error,
  disabled = false,
  className = "",
  minDate,
  helperText,
  triggerClassName,
}: BirthDatePickerProps) {
  const parseISOToDate = (iso?: string) => {
    if (!iso) return undefined
    const [y, m, d] = iso.split("-").map(Number)
    if (!y || !m || !d) return undefined
    const dt = new Date(y, m - 1, d)
    dt.setHours(0, 0, 0, 0)
    return dt
  }

  const toISODate = (d: Date) => {
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    const dd = String(d.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
  }

  // ✅ solo existe si minAge viene definido
  const maxBirthDateObj = useMemo(() => {
    if (typeof minAge !== "number") return undefined
    const t = new Date()
    t.setFullYear(t.getFullYear() - minAge)
    t.setHours(0, 0, 0, 0)
    return t
  }, [minAge])

  const minDateObj = useMemo(() => {
    if (!minDate) return undefined
    return parseISOToDate(minDate)
  }, [minDate])

  const selectedDate = useMemo(() => parseISOToDate(value), [value])

  // Mes mostrado (controlado)
  const [displayMonth, setDisplayMonth] = useState<Date>(() => {
    if (selectedDate) return selectedDate
    if (minDateObj) return minDateObj
    if (maxBirthDateObj) return maxBirthDateObj
    return new Date()
  })

  useEffect(() => {
    if (selectedDate) setDisplayMonth(selectedDate)
    else if (minDateObj) setDisplayMonth(minDateObj)
    else if (maxBirthDateObj) setDisplayMonth(maxBirthDateObj)
    else setDisplayMonth(new Date())
  }, [value, minDate, maxBirthDateObj, selectedDate, minDateObj])

  // ✅ Deshabilitar fechas según modo:
  // - minDate => bloquea antes de minDate
  // - minAge  => bloquea después de maxBirthDate
  // - ninguno => no bloquea nada
  const disabledDate = (date: Date) => {
    const dt = new Date(date)
    dt.setHours(0, 0, 0, 0)

    if (minDateObj) return dt < minDateObj
    if (maxBirthDateObj) return dt > maxBirthDateObj
    return false
  }

  // Rango años
  const fromYear = useMemo(() => {
    if (minDateObj) return minDateObj.getFullYear()
    return 1950
  }, [minDateObj])

  const toYear = useMemo(() => {
    if (minDateObj) {
      const base = new Date().getFullYear()
      return Math.max(base + 10, minDateObj.getFullYear() + 10)
    }
    if (maxBirthDateObj) return maxBirthDateObj.getFullYear()
    return new Date().getFullYear() + 10
  }, [minDateObj, maxBirthDateObj])

  const monthNames = useMemo(
    () => [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    []
  )

  const monthOptions = useMemo(() => monthNames.map((label, idx) => ({ value: idx, label })), [monthNames])

  const years = useMemo(() => {
    const arr: number[] = []
    for (let y = toYear; y >= fromYear; y--) arr.push(y)
    return arr
  }, [fromYear, toYear])

  const yearOptions = useMemo(() => years.map((y) => ({ value: y, label: String(y) })), [years])

  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const handleMonthChange = (monthValue: string | number) => {
    const newMonth = typeof monthValue === "string" ? parseInt(monthValue, 10) : monthValue
    if (Number.isNaN(newMonth)) return
    const next = new Date(displayMonth)
    next.setMonth(newMonth as number)
    setDisplayMonth(next)
  }

  const handleYearChange = (yearValue: string | number) => {
    const newYear = typeof yearValue === "string" ? parseInt(yearValue, 10) : yearValue
    if (Number.isNaN(newYear)) return
    const next = new Date(displayMonth)
    next.setFullYear(newYear as number)
    setDisplayMonth(next)
  }

  const displayText = useMemo(() => {
    if (!selectedDate) return placeholder
    return selectedDate.toLocaleDateString("es-CR", { day: "2-digit", month: "long", year: "numeric" })
  }, [placeholder, selectedDate])

  // ✅ CLAVE: si helperText existe (aunque sea ""), NO usamos el texto por defecto
  const helperTextIsProvided = helperText !== undefined

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            type="button"
            variant="outline"
            disabled={disabled}
            className={`w-full justify-between shadow-sm hover:bg-[#E6EDC8]/40 ${
              error ? "border-[#9c1414]" : "border-[#DCD6C9]"
            } ${triggerClassName ?? ""}`}
          >
            <span className={value ? "text-[#4A4A4A]" : "text-gray-400"}>{displayText}</span>
            <CalendarIcon className="h-4 w-4 text-[#708C3E]" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[260px] p-2 rounded-xl border border-[#DCD6C9] shadow-md bg-white">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-[120px]">
              <CustomSelect
                size="sm"
                value={displayMonth.getMonth()}
                onChange={handleMonthChange}
                options={monthOptions}
                placeholder="Mes"
                disabled={disabled}
                zIndex={50}
              />
            </div>

            <div className="w-[96px]">
              <CustomSelect
                size="sm"
                value={displayMonth.getFullYear()}
                onChange={handleYearChange}
                options={yearOptions}
                placeholder="Año"
                disabled={disabled}
                zIndex={50}
              />
            </div>
          </div>

          <Calendar
            mode="single"
            month={displayMonth}
            onMonthChange={(m) => setDisplayMonth(m)}
            selected={selectedDate}
            onSelect={(d) => {
              if (!d) return
              if (disabledDate(d)) return
              onChange(toISODate(d))
              setOpen(false)
              setTimeout(() => triggerRef.current?.focus(), 0)
            }}
            locale={es}
            hideNavigation
            fromYear={fromYear}
            toYear={toYear}
            disabled={disabledDate}
            defaultMonth={selectedDate ?? (minDateObj ?? maxBirthDateObj ?? new Date())}
            className="rounded-lg [--cell:28px]"
            classNames={{
              months: "flex flex-col",
              month: "space-y-2",
              caption: "hidden",
              head_row: "flex",
              head_cell: "text-[#708C3E] w-[var(--cell)] h-6 grid place-items-center font-semibold text-[11px]",
              row: "flex gap-[2px]",
              table: "w-full border-collapse",
              day: "h-[var(--cell)] w-[var(--cell)] p-0 text-[12px]",
              day_button:
                "h-full w-full rounded-md grid place-items-center outline-none transition-colors hover:bg-[#E6EDC8]/60 focus-visible:ring-2 focus-visible:ring-[#708C3E]/30",
              day_selected: "bg-[#708C3E] text-white hover:bg-[#5d7334] hover:text-white",
              day_today: "border border-[#A3853D]",
              day_disabled: "text-gray-300 opacity-50",
              day_outside: "text-gray-300 opacity-60",
            }}
          />

          {helperTextIsProvided ? (
            helperText ? <p className="mt-2 text-[10px] text-gray-500">{helperText}</p> : null
          ) : typeof minAge === "number" ? (
            <p className="mt-2 text-[10px] text-gray-500">
              Debe ser mayor de <span className="font-medium text-[#6F8C1F]">{minAge} años</span>.
            </p>
          ) : null}
        </PopoverContent>
      </Popover>

      {error && <p className="text-sm text-[#9c1414] mt-1">{error}</p>}
    </div>
  )
}

export const BirthDatePicker = memo(_BirthDatePicker)