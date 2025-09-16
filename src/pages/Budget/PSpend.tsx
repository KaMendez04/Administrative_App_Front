import { useState } from "react";
import { Plus } from "lucide-react";
import PSpendForm from "../../components/Budget/PSpend/PSpendForm";
import CatalogModal from "../../components/Budget/Spend/CatalogModal"; 
// Reutilizamos el modal de catálogo de spend (dept/tipo/subtipo)

export default function PExpenses() {
  const [openCatalog, setOpenCatalog] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F8F5]">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <div className="relative rounded-3xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-gray-100 p-6 md:p-10">

          <button
            onClick={() => setOpenCatalog(true)}
            className="absolute top-6 right-6 rounded-full bg-[#708C3E] p-3 text-white shadow hover:bg-[#5e732f]"
            aria-label="Abrir catálogo"
          >
            <Plus className="h-6 w-6" />
          </button>

          <PSpendForm onSuccess={() => { /* opcional: toast/refetch */ }} />
        </div>
      </div>

      <CatalogModal open={openCatalog} onClose={() => setOpenCatalog(false)} />
    </div>
  );
}
