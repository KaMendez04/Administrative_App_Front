import { AssociateStatusEnum } from "../../schemas/adminAssociates";

type Props = {
  status?: "PENDIENTE" | "APROBADO" | "RECHAZADO";
  search?: string;
  onChange: (p: { status?: "PENDIENTE" | "APROBADO" | "RECHAZADO"; search?: string }) => void;
};

export function AssociateFilters({ status, search, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="text-sm font-bold text-[#33361D]">Filtros</div>
      
      <input
        placeholder="Buscar por cédula, nombre, email..."
        value={search ?? ""}
        onChange={(e) => onChange({ status, search: e.target.value })}
        className="w-full rounded-xl border-2 border-[#EAEFE0] bg-white p-3 text-[#33361D] placeholder:text-gray-400 focus:ring-2 focus:ring-[#5B732E] focus:border-[#5B732E] outline-none transition"
      />

      <div className="flex flex-wrap gap-2">
        {AssociateStatusEnum.options.map((s) => (
          <button
            key={s}
            onClick={() => onChange({ status: s as any, search })}
            className={`px-4 py-2 rounded-xl font-semibold transition ${
              status === s
                ? "bg-[#5B732E] text-white shadow-sm"
                : "border-2 border-[#EAEFE0] text-[#33361D] hover:bg-[#EAEFE0]"
            }`}
          >
            {s}
          </button>
        ))}
        <button
          onClick={() => onChange({ status: undefined, search })}
          className={`px-4 py-2 rounded-xl font-semibold transition ${
            !status
              ? "bg-[#5B732E] text-white shadow-sm"
              : "border-2 border-[#EAEFE0] text-[#33361D] hover:bg-[#EAEFE0]"
          }`}
        >
          Todos
        </button>
      </div>
    </div>
  );
}