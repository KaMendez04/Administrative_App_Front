interface PersonalPageSearchProps {
  value: string
  onChange: (value: string) => void
}

export function PersonalPageSearch({ value, onChange }: PersonalPageSearchProps) {
  return (
    <input
      type="text"
      placeholder="Buscar por nombre, apellido o cédula"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 px-6 py-3 rounded-lg shadow-sm text-base bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#A3853D]"
    />
  )
}
