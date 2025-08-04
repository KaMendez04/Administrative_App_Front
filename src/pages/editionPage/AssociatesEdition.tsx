import NavbarEditionSection from "../../components/NavbarEditionSection"

function AssociatesEdition() {
  return (
    <div className="min-h-screen bg-white text-[#2E321B] py-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Navegación superior */}
        <NavbarEditionSection/>

        {/* 🆕 Agregar nueva sección */}
        <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-8 shadow mb-12">
          <h2 className="text-2xl font-semibold mb-6">Agregar nueva sección sobre Asociados</h2>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Título"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div className="mb-6">
            <textarea
              rows={4}
              placeholder="Descripción"
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

        {/* ✏️ Editar sección existente */}
        <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-8 shadow space-y-6 mb-12">
          <h2 className="text-2xl font-semibold">Editar Existente</h2>

          {/* Selector de sección */}
          <select className="w-full border border-gray-300 rounded-md px-4 py-2">
            <option>¿Por qué asociarse a la Cámara de Ganaderos de Hojancha?</option>
          </select>

          {/* Contenido editable */}
          <div className="border border-gray-300 rounded-xl p-6 space-y-4">
            <div>
              <label htmlFor="assocTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                id="assocTitle"
                type="text"
                defaultValue="¿Por qué asociarse a la Cámara de Ganaderos de Hojancha?"
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            </div>

            <div>
              <label htmlFor="assocDesc" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                id="assocDesc"
                rows={4}
                defaultValue="Porque ser parte de la Cámara te permite mejorar tu producción, ahorrar costos y estar acompañado por una red de ganaderos con los mismos objetivos."
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

        {/* 🔽 Beneficios y Requisitos (desplegables simulados) */}
        <div className="space-y-4">
          <select className="w-full border border-gray-300 rounded-md px-4 py-2">
            <option>BENEFICIOS</option>
          </select>
          <select className="w-full border border-gray-300 rounded-md px-4 py-2">
            <option>REQUISITOS</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default AssociatesEdition
