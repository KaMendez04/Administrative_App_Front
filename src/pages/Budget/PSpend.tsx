// src/pages/Budget/PSpend.tsx
import { useState } from "react";
import { Plus } from "lucide-react";
import PSpendForm from "../../components/Budget/PSpend/PSpendForm";
import CatalogModalPSpend from "../../components/Budget/PSpend/CatalogModalPSpend";

export default function PExpenses() {
  const [openCatalog, setOpenCatalog] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F8F5]">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <div className="relative rounded-3xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-gray-100 p-6 md:p-10">

          {/* Botón catálogo */}
          <button
            onClick={() => setOpenCatalog(true)}
            className="absolute top-6 right-6 rounded-full bg-[#708C3E] p-3 text-white shadow hover:bg-[#5e732f]"
            aria-label="Abrir catálogo"
          >
            <Plus className="h-6 w-6" />
          </button>

          {/* Form sin remount */}
          <PSpendForm onSuccess={() => { /* opcional */ }} />
        </div>
      </div>

      {/* Catálogo P-Types / P-SubTypes */}
      <CatalogModalPSpend
        open={openCatalog}
        onClose={() => setOpenCatalog(false)}
        onAccept={() => setOpenCatalog(false)}
      />
    </div>
  );
}
