import { ActionButtons } from "../../components/ActionButtons"
import NavbarEditionSection from "../../components/NavbarEditionSection"
import { useServicesInformative } from "../../hooks/EditionSection/ServicesHook"
import ServicesInformativeEditor from "./service/ServiceEditor"
import ServicesInformativeCreator from "./service/ServicesCreator"
import { useNavigate } from "@tanstack/react-router"

export default function ServicesEdition() {
  const {
    items: services,
    selectedId: selectedServiceId,
    setSelectedId: setSelectedServiceId,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useServicesInformative()

  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#f3f8ef] text-[#2E321B] p-4">
      <div className="max-w-5xl mx-auto">
        <NavbarEditionSection />

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Edición de la Sección Servicios</h1>
          <p className="text-base text-[#475C1D]">
            Agrega, edita o elimina los servicios que se muestran públicamente.
          </p>
        </div>

        {/* Agregar servicio */}
        <div className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-8 shadow mb-6">
          <ServicesInformativeCreator onSubmit={handleCreate} />
        </div>

        {/* Editar servicio */}
        <div className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-8 shadow mb-6">
          <ServicesInformativeEditor
            items={services}
            selectedId={selectedServiceId}
            setSelectedId={setSelectedServiceId}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </div>

        {/*Botón de regresar abajo a la derecha */}
        <div className="flex justify-end mt-6">
        <ActionButtons
            showBack={true}
            onBack={() => navigate({ to: "/Principal" })}
            backText="Regresar"
            showText={true}
          />        
        </div>
      </div>
    </div>
  )
}