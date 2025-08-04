import NavbarEditionSection from "../../components/NavbarEditionSection"

function PrincipalEdition() {
  return (
    <div className="min-h-screen bg-white text-[#2E321B] py-16 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Navegación superior */}
        <NavbarEditionSection/>
        
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Edición de la Sección Principal</h1>
          <p className="text-base text-[#475C1D]">
            Aquí podrás modificar la información principal que aparece en la página de inicio.
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-8 shadow">
          <h2 className="text-2xl font-semibold mb-6">Editar Existente</h2>

          {/* Título */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              id="title"
              defaultValue="Asociación Cámara de Ganaderos"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
            />
          </div>

          {/* Descripción */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              rows={5}
              defaultValue="Lorem ipsum dolor sit amet consectetur adipiscing elit tellus mauris..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
            />
          </div>

          {/* Imagen */}
          <div className="mb-8">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Imagen
            </label>
            <input
              type="text"
              id="image"
              defaultValue="https://www.google.com/imgres?q=bookmgu40gQAA"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
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

export default PrincipalEdition
