
function VolunteersEdition() {
  return (
    <div className="min-h-screen bg-white text-[#2E321B] py-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* 🔘 Navegación superior */}
        <div className="flex flex-wrap gap-4 justify-center mb-12 border-b pb-4">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
            Principal
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
            Sobre Nosotros
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
            Servicios
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
            Asociados
          </button>
          <button className="px-4 py-2 border border-[#708C3E] rounded-md text-[#708C3E] font-medium bg-[#F5F7EC] hover:bg-[#EEF4D8]">
            Voluntarios
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
            Preguntas
          </button>
        </div>

        {/* 🆕 Agregar nueva sección */}
        <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-8 shadow mb-12">
          <h2 className="text-2xl font-semibold mb-6">Agregar nueva sección sobre Voluntarios</h2>

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

          {/* Selector */}
          <select className="w-full border border-gray-300 rounded-md px-4 py-2">
            <option>¿Por qué ser voluntario en la Cámara de Ganaderos de Hojancha?</option>
          </select>

          {/* Contenido editable */}
          <div className="border border-gray-300 rounded-xl p-6 space-y-4">
            <div>
              <label htmlFor="volTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                id="volTitle"
                type="text"
                defaultValue="¿Por qué ser voluntario en la Cámara de Ganaderos de Hojancha?"
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            </div>

            <div>
              <label htmlFor="volDesc" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                id="volDesc"
                rows={4}
                defaultValue="Porque ser voluntario te permite apoyar al sector ganadero local, contribuir con el desarrollo sostenible de la comunidad y adquirir experiencia en distintas áreas relacionadas con el agro y el medio ambiente."
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

        {/* 🔽 Desplegables */}
        <div className="space-y-4">
          <select className="w-full border border-gray-300 rounded-md px-4 py-2">
            <option>BENEFICIOS</option>
          </select>
          <select className="w-full border border-gray-300 rounded-md px-4 py-2">
            <option>TIPOS DE VOLUNTARIADO</option>
          </select>
          <select className="w-full border border-gray-300 rounded-md px-4 py-2">
            <option>REQUISITOS</option>
          </select>
          <select className="w-full border border-gray-300 rounded-md px-4 py-2">
            <option>NORMAS DE CUMPLIMIENTO</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default VolunteersEdition
