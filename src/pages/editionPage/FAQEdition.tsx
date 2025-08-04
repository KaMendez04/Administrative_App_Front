import NavbarEditionSection from "../../components/NavbarEditionSection"

function FAQEdition() {
  return (
    <div className="min-h-screen bg-white text-[#2E321B] py-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Navegación superior */}
        <NavbarEditionSection/>

        {/* 🆕 Agregar nueva pregunta */}
        <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-8 shadow mb-12">
          <h2 className="text-2xl font-semibold mb-6">Agregar nueva Pregunta Frecuente</h2>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Pregunta"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div className="mb-6">
            <textarea
              rows={4}
              placeholder="Respuesta"
              className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none"
            />
          </div>

          <div className="flex gap-4 justify-end">
            <button className="px-4 py-2 rounded-md border border-green-600 text-green-600 hover:bg-green-50 font-semibold">
              Guardar
            </button>
            <button className="px-4 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100">
              Borrar
            </button>
          </div>
        </div>

        {/* ✏️ Editar FAQ existente */}
        <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-8 shadow space-y-6">
          <h2 className="text-2xl font-semibold">Editar Pregunta Frecuente</h2>

          {/* Selector de pregunta */}
          <select className="w-full border border-gray-300 rounded-md px-4 py-2">
            <option>¿Cómo puedo asociarme a la Cámara de Ganaderos?</option>
          </select>

          {/* Contenido editable */}
          <div className="border border-gray-300 rounded-xl p-6 space-y-4">
            <div>
              <label htmlFor="faqQuestion" className="block text-sm font-medium text-gray-700 mb-1">
                Pregunta
              </label>
              <input
                id="faqQuestion"
                type="text"
                defaultValue="¿Cómo puedo asociarme a la Cámara de Ganaderos?"
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            </div>

            <div>
              <label htmlFor="faqAnswer" className="block text-sm font-medium text-gray-700 mb-1">
                Respuesta
              </label>
              <textarea
                id="faqAnswer"
                rows={4}
                defaultValue="Puedes asociarte completando el formulario disponible en la sección de asociados o acercándote a nuestras oficinas."
                className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button className="px-4 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100">
                Editar
              </button>
              <button className="px-4 py-2 rounded-md border border-green-600 text-green-600 hover:bg-green-50 font-semibold">
                Guardar
              </button>
              <button className="px-4 py-2 rounded-md border border-red-500 text-red-500 hover:bg-red-50 font-semibold">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQEdition
