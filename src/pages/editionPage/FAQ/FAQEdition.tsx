import NavbarEditionSection from "../../../components/NavbarEditionSection"
import BackButton from "../../../components/PagesEdition/BackButton"
import { useFaqManager } from "../../../hooks/EditionSection/FAQHook"
import FAQCreator from "../FAQ/FAQCreator"
import FAQEditor from "../FAQ/FAQEditor"

export default function FAQEdition() {
  const {
    faqs,
    selectedFaqId,
    setSelectedFaqId,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useFaqManager()

  return (
    <div className="min-h-screen bg-white text-[#2E321B] py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <NavbarEditionSection />

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Edición de la Sección Preguntas Frecuentes</h1>
          <p className="text-base text-[#475C1D]">
            Modifica o agrega las preguntas frecuentes que los usuarios suelen tener.
          </p>
        </div>

        {/* Agregar nueva FAQ */}
        <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-8 shadow mb-12">
          <h2 className="text-2xl font-semibold mb-6">Agregar nueva Pregunta Frecuente</h2>
          <FAQCreator onSubmit={handleCreate} />
        </div>

        {/* Editar/eliminar FAQ existente */}
        <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-8 shadow">
          <h2 className="text-2xl font-semibold mb-6">Editar Pregunta Frecuente</h2>
          <FAQEditor
            faqs={faqs}
            selectedFaqId={selectedFaqId}
            setSelectedFaqId={setSelectedFaqId}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </div>

        {/* Botón de regresar abajo a la derecha */}
        <div className="flex justify-end mt-8">
          <BackButton label="Regresar" />
        </div>
      </div>
    </div>
  )
}
