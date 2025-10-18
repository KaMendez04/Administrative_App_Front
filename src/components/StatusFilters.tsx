interface StatusFiltersProps {
  status: string | undefined;
  onStatusChange: (status: string | undefined) => void;
  search: string;
  onSearchChange: (search: string) => void;
  searchPlaceholder?: string;
  statusOptions?: string[];
  showAllOption?: boolean;
}

export function StatusFilters({
  status,
  onStatusChange,
  search,
  onSearchChange,
  searchPlaceholder = "Buscar por cédula, nombre, email...",
  statusOptions = ["PENDIENTE", "APROBADO", "RECHAZADO"],
  showAllOption = true,
}: StatusFiltersProps) {
  return (
    <div className="rounded-2xl bg-[#F8F9F3] p-5 shadow-sm mb-6">
      <div className="text-sm font-bold text-[#33361D] mb-4">Filtros</div>

      <div className="mb-4">
        <input
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-[#E6EDC8] bg-white p-3 text-[#33361D] placeholder:text-gray-400 focus:ring-2 focus:ring-[#E6EDC8] focus:border-[#E6EDC8] outline-none transition"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {statusOptions.map((s) => (
          <button
            key={s}
            onClick={() => onStatusChange(s as any)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              status === s
                ? "bg-[#5B732E] text-[#FFFFFF]"
                : "bg-white text-[#6B6B6B] hover:bg-[#E6EDC8]"
            }`}
          >
            {s}
          </button>
        ))}
        {showAllOption && (
          <button
            onClick={() => onStatusChange(undefined)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              !status
                ? "bg-[#5B732E] text-[#FFFFFF]"
                : "bg-white text-[#6B6B6B] hover:bg-[#E6EDC8]"
            }`}
          >
            Todos
          </button>
        )}
      </div>
    </div>
  );
}