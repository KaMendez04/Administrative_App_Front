// src/pages/Budget/PSpend.tsx
import { useState } from "react";
import { Plus } from "lucide-react";
import PSpendForm from "../../components/Budget/PSpend/PSpendForm";
import CatalogModalPSpend from "../../components/Budget/PSpend/CatalogModalPSpend";

export default function PExpenses() {
  const [openCatalog, setOpenCatalog] = useState(false);
  const [catalogTick, setCatalogTick] = useState(0); // fuerza remount del form tras "Listo"

  return (
    <div className="min-h-screen bg-[#F7F8F5] pt-20 md:pt-24 relative z-0">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <div className="relative rounded-3xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-gray-100 p-6 md:p-10">
          {/* Título */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Proyección de Egresos
          </h1>

          {/* Botón catálogo */}
          <button
            onClick={() => setOpenCatalog(true)}
            className="absolute top-6 right-6 rounded-full bg-[#708C3E] p-3 text-white shadow hover:bg-[#5e732f]"
            aria-label="Abrir catálogo"
          >
            <Plus className="h-6 w-6" />
          </button>

          {/* Remount del form para refrescar selects tras crear en catálogo */}
          <PSpendForm key={catalogTick} onSuccess={() => { /* opcional: toast/refetch */ }} />
        </div>
      </div>

      {/* Catálogo para P-Types / P-SubTypes (p-spend-*) */}
      <CatalogModalPSpend
        open={openCatalog}
        onClose={() => setOpenCatalog(false)}
        onAccept={() => {
          setCatalogTick((n) => n + 1); // vuelve a cargar tipos/subtipos en el form
          setOpenCatalog(false);
        }}
      />
    </div>
  );
}
