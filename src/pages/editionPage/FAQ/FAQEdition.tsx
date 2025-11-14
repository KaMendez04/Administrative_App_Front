import { useNavigate } from "@tanstack/react-router"
import NavbarEditionSection from "../../../components/NavbarEditionSection"
import { useFaqManager } from "../../../hooks/EditionSection/FAQHook"
import FAQCreator from "../FAQ/FAQCreator"
import FAQEditor from "../FAQ/FAQEditor"
import { ActionButtons } from "../../../components/ActionButtons"

export default function FAQEdition() {
  const {
    faqs,
    selectedFaqId,
    setSelectedFaqId,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useFaqManager()
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#f3f8ef] text-[#2E321B] p-4">
      <div className="max-w-5xl mx-auto">
        <NavbarEditionSection />

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Edición de la Sección Preguntas Frecuentes</h1>
          <p className="text-base text-[#475C1D]">
            Modifica o agrega las preguntas frecuentes que los usuarios suelen tener.
          </p>
        </div>

        {/* Agregar nueva FAQ */}
        <div className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-4 shadow mb-6">
          <FAQCreator onSubmit={handleCreate} />
        </div>

        {/* Editar/eliminar FAQ existente */}
        <div className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-4 shadow">
          <FAQEditor
            faqs={faqs}
            selectedFaqId={selectedFaqId}
            setSelectedFaqId={setSelectedFaqId}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </div>

        {/* Botón de regresar abajo a la derecha */}
        <div className="flex justify-end mt-6">
           <ActionButtons
                      onBack={() => navigate({ to: "/Principal" })}
                      showBack={true}
                      backText="Regresar"
                      showText={true}
                    />
        </div>
      </div>
    </div>
  )
}
