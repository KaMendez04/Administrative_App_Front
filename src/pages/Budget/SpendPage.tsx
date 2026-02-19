import { useState } from "react"
import { Plus, Pencil, ChevronDown } from "lucide-react"

import SpendForm from "../../components/Budget/Spend/SpendForm"
import CatalogModalSpend from "@/components/Budget/Spend/CatalogModal"

export default function SpendPage() {
  const [openCatalog, setOpenCatalog] = useState(false)
  const [openEditCatalog, setOpenEditCatalog] = useState(false)

  return (
    <div className="min-h-screen bg-[#f3f8ef]">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <div className="grid gap-6">
          {/* ===== Card principal ===== */}
          <div className="relative rounded-3xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-gray-100 p-6 md:p-10">
            <div className="absolute top-6 right-6">
              <button
                onClick={() => setOpenCatalog(true)}
                className="rounded-full bg-[#708C3E] p-3 text-white shadow hover:bg-[#5e732f]"
                aria-label="Abrir catálogo"
                title="Agregar al catálogo"
              >
                <Plus className="h-6 w-6" />
              </button>
            </div>

            <SpendForm onSuccess={() => {}} />
          </div>

          {/* ===== Editar Catálogo (ACORDEÓN) ===== */}
          <div className="rounded-3xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-gray-100">
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <Pencil className="h-5 w-5 text-[#33361D]" />
                <h3 className="text-base font-semibold text-[#33361D]">
                  Editar Catálogo de Egresos
                </h3>
              </div>

              <button
                onClick={() => setOpenEditCatalog((v) => !v)}
                className="rounded-full bg-[#708C3E] p-3 text-white shadow hover:bg-[#5e732f]"
                aria-label={openEditCatalog ? "Cerrar" : "Abrir"}
                title={openEditCatalog ? "Cerrar" : "Abrir"}
              >
                <ChevronDown
                  className={`h-6 w-6 transition-transform duration-200 ${
                    openEditCatalog ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {/* Línea SOLO cuando está abierto */}
            <div
              className={`border-t transition-colors duration-200 ${
                openEditCatalog ? "border-black" : "border-transparent"
              }`}
            />

            {/* CONTENIDO */}
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                openEditCatalog ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div
                className={`overflow-hidden px-6 transition-all duration-200 ${
                  openEditCatalog ? "py-6" : "py-0"
                }`}
              >
                <CatalogModalSpend
                  open={openEditCatalog}
                  onClose={() => setOpenEditCatalog(false)}
                  mode="edit"
                  inline
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal crear */}
      <CatalogModalSpend
        open={openCatalog}
        onClose={() => setOpenCatalog(false)}
        mode="create"
      />
    </div>
  )
}
