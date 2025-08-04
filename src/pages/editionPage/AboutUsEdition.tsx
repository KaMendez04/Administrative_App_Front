
function AboutUsEdition() {
  return (
    <div className="min-h-screen bg-white text-[#2E321B] py-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* 🔘 Navegación superior */}
        <div className="flex flex-wrap gap-4 justify-center mb-12 border-b pb-4">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
            Principal
          </button>
          <button className="px-4 py-2 border border-[#708C3E] rounded-md text-[#708C3E] font-medium bg-[#F5F7EC] hover:bg-[#EEF4D8]">
            Sobre Nosotros
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
            Servicios
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
            Asociados
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
            Voluntarios
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
            Preguntas
          </button>
        </div>

        {/* 📝 Encabezado */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Edición de la Sección Sobre Nosotros</h1>
          <p className="text-base text-[#475C1D]">
            Modifica la historia, misión y visión institucional de la Cámara.
          </p>
        </div>

        {/* 📄 Formulario */}
        <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-8 shadow">
          <h2 className="text-2xl font-semibold mb-6">Editar Contenido</h2>

          {/* Historia */}
          <div className="mb-6">
            <label htmlFor="history" className="block text-sm font-medium text-gray-700 mb-1">
              Historia
            </label>
            <textarea
              id="history"
              rows={4}
              defaultValue="Nuestra historia inicia con la unión de ganaderos locales en busca de representación y desarrollo..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
            />
          </div>

          {/* Misión */}
          <div className="mb-6">
            <label htmlFor="mission" className="block text-sm font-medium text-gray-700 mb-1">
              Misión
            </label>
            <textarea
              id="mission"
              rows={3}
              defaultValue="Representar y fortalecer al sector ganadero mediante servicios que impulsen su sostenibilidad."
              className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
            />
          </div>

          {/* Visión */}
          <div className="mb-8">
            <label htmlFor="vision" className="block text-sm font-medium text-gray-700 mb-1">
              Visión
            </label>
            <textarea
              id="vision"
              rows={3}
              defaultValue="Ser una organización líder en innovación ganadera con impacto regional y nacional."
              className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
            />
          </div>

          {/* Botones */}
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
  )
}

export default AboutUsEdition
