import { useState } from "react";
import { Plus, Pencil } from "lucide-react";

import PIncomeForm from "../../components/Budget/ProjectionIncome/PIncomeForm";
import PCatalogModal from "../../components/Budget/ProjectionIncome/PIncomeCatalogModal";

import PIncomeList from "../../components/Budget/ProjectionIncome/PIncomeList";

export default function PIncomePage() {
  const [openCatalog, setOpenCatalog] = useState(false);
  const [openEditCatalog, setOpenEditCatalog] = useState(false);

  return (
    <div className="min-h-screen bg-[#f3f8ef]">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <div className="grid gap-6">
          <div className="relative rounded-3xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-gray-100 p-6 md:p-10">
            {/* Botones arriba a la derecha */}
            <div className="absolute top-6 right-6 flex items-center gap-3">
              {/* ✏️ Editar catálogo */}
              <button
                onClick={() => setOpenEditCatalog(true)}
                className="rounded-full bg-[#6B7A3A] p-3 text-white shadow hover:opacity-90"
                aria-label="Editar catálogo"
                title="Editar catálogo"
              >
                <Pencil className="h-6 w-6" />
              </button>

              {/* ➕ Agregar catálogo */}
              <button
                onClick={() => setOpenCatalog(true)}
                className="rounded-full bg-[#708C3E] p-3 text-white shadow hover:bg-[#5e732f]"
                aria-label="Abrir catálogo"
                title="Agregar al catálogo"
              >
                <Plus className="h-6 w-6" />
              </button>
            </div>

            <PIncomeForm onSuccess={() => {}} />
          </div>

          <PIncomeList />
        </div>
      </div>

      {/* Modal: AGREGAR */}
      <PCatalogModal
        open={openCatalog}
        onClose={() => setOpenCatalog(false)}
        mode="create"
      />

      {/* Modal: EDITAR */}
      <PCatalogModal
        open={openEditCatalog}
        onClose={() => setOpenEditCatalog(false)}
        mode="edit"
      />
    </div>
  );
}
