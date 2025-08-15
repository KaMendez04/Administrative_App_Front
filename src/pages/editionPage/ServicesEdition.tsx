// src/pages/editionPage/ServicesEdition.tsx
import NavbarEditionSection from "../../components/NavbarEditionSection"
import { useServicesInformative } from "../../hooks/EditionSection/ServicesHook"
import ServicesInformativeEditor from "./service/ServiceEditor"
import ServicesInformativeCreator from "./service/ServicesCreator"

export default function ServicesEdition() {
  const {
    items: services,
    selectedId: selectedServiceId,
    setSelectedId: setSelectedServiceId,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useServicesInformative()

  return (
    <div className="min-h-screen bg-white text-[#2E321B] py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <NavbarEditionSection />

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Edición de Servicios</h1>
          <p className="text-base text-[#475C1D]">
            Agrega, edita o elimina los servicios que se muestran públicamente.
          </p>
        </div>

        {/* Agregar servicio */}
        <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-8 shadow mb-12">
          <h2 className="text-2xl font-semibold mb-6">Agregar nuevo Servicio</h2>
          <ServicesInformativeCreator onSubmit={handleCreate} />
        </div>

        {/* Editar servicio */}
        <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-8 shadow">
          <h2 className="text-2xl font-semibold mb-6">Editar Servicio Existente</h2>
          <ServicesInformativeEditor
            items={services}
            selectedId={selectedServiceId}
            setSelectedId={setSelectedServiceId}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  )
}
