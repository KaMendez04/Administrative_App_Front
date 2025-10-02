import { useState } from "react";
import { Plus } from "lucide-react";
import PIncomeForm from "./components/PIncomeForm";


export default function PIncomePage() {
  const [openCatalog, setOpenCatalog] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F8F5]">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <div className="relative rounded-3xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-gray-100 p-6 md:p-10">
          {/* Botón + arriba a la derecha (abre modal catálogo) */}
          <button
            onClick={() => setOpenCatalog(true)}
            className="absolute top-6 right-6 rounded-full bg-[#708C3E] p-3 text-white shadow hover:bg-[#5e732f]"
            aria-label="Abrir catálogo"
          >
            <Plus className="h-6 w-6" />
          </button>

          {/* Formulario principal */}
          <PIncomeForm
            onSuccess={() => {
              // (mantén tu lógica aquí si deseas)
            }}
          />
        </div>
      </div>

      {/* Modal: agregar Departamento / Tipo / SubTipo */}
      <PCatalogModal
        open={openCatalog}
        onClose={() => setOpenCatalog(false)}
      />
    </div>
  );
}
