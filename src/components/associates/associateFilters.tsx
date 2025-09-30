import { AssociateStatusEnum } from "../../schemas/adminAssociates";

type Props = {
  status?: "PENDIENTE" | "APROBADO" | "RECHAZADO";
  search?: string;
  onChange: (p: { status?: "PENDIENTE" | "APROBADO" | "RECHAZADO"; search?: string }) => void;
};

export function AssociateFilters({ status, search, onChange }: Props) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-4">
      <div className="flex gap-2">
        {AssociateStatusEnum.options.map((s) => (
          <button
            key={s}
            onClick={() => onChange({ status: s as any, search })}
            className={`px-3 py-1 rounded border ${status === s ? "bg-[#708C3E] text-white" : "bg-white"}`}
          >
            {s}
          </button>
        ))}
        <button
          onClick={() => onChange({ status: undefined, search })}
          className={`px-3 py-1 rounded border ${!status ? "bg-[#708C3E] text-white" : "bg-white"}`}
        >
          Todos
        </button>
      </div>

      <input
        placeholder="Buscar por cédula, nombre, email..."
        value={search ?? ""}
        onChange={(e) => onChange({ status, search: e.target.value })}
        className="px-3 py-2 border rounded w-full md:w-80"
      />
    </div>
  );
}
