import { useCallback, useState } from "react"

type MoneyFormatOptions = {
    maxIntDigits?: number
    maxDecimals?: number
}

export function formatCR(value: string, opts: MoneyFormatOptions = {}): string {
    const maxIntDigits = opts.maxIntDigits ?? 15
    const maxDecimals = opts.maxDecimals ?? 2
    if (!value) return ""

    let raw = value.replace(/[^\d,\.]/g, "")

    const commaIdx = raw.indexOf(",")
    const hasComma = commaIdx !== -1

    let intRaw = raw
    let decRaw = ""

    if (hasComma) {
        intRaw = raw.slice(0, commaIdx)
        decRaw = raw.slice(commaIdx + 1)
    }

    const intDigits = intRaw.replace(/\D/g, "").slice(0, maxIntDigits)

    const intFormatted = intDigits
        ? intDigits.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
        : ""

    if (!hasComma) return intFormatted

    const decDigits = decRaw.replace(/\D/g, "").slice(0, maxDecimals)

    return `${intFormatted},${decDigits}`
}

export function parseCR(formatted: string): number {
    if (!formatted) return 0

    const normalized = formatted
        .replace(/\s/g, "")
        .replace(",", ".")
        .replace(/[^\d.]/g, "")

    const n = Number(normalized)
    return Number.isFinite(n) ? n : 0
}

export function useMoneyInput(initial: string) {
    const [value, setValue] = useState(initial)

    const handleInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
        const target = e.currentTarget
        setValue(formatCR(target.value))
    }, [])

    const handleValue = useCallback((nextRaw: string) => {
        const formatted = formatCR(nextRaw)
        setValue(formatted)
        return formatted
    }, [])

    return { value, setValue, handleInput, handleValue, formatCR, parseCR }
}