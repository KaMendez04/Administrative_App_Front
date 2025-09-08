export function CharCounter({ value, max }: { value: string; max: number }) {
  const used = (value ?? "").length
  const remaining = Math.max(0, max - used)
  const color =
    remaining === 0 ? "text-red-600" : remaining <= 20 ? "text-amber-600" : "text-slate-500"

  return (
    <p className={`mt-1 text-xs ${color}`}>
      Quedan <span className="tabular-nums">{remaining}</span> de {max} caracteres
    </p>
  )
}
