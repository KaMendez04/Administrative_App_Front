import NavbarEditionSection from "../../components/NavbarEditionSection"

function ServicesEdition() {
  return (
    <div className="min-h-screen bg-white text-[#2E321B] py-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Navegación superior */}
        <NavbarEditionSection/>

        {/* 📝 Encabezado */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Edición de la Sección Servicios</h1>
          <p className="text-base text-[#475C1D]">
            Modifica o agrega los servicios que la Cámara ofrece a sus asociados y al público en general.
          </p>
        </div>

        {/* 🆕 Agregar nuevo servicio */}
        <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-8 shadow mb-12">
          <h2 className="text-2xl font-semibold mb-6">Agregar nueva sección Servicios</h2>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Título"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div className="mb-4">
            <textarea
              rows={4}
              placeholder="Descripción"
              className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none"
            />
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Link img"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
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

        {/* ✏️ Editar servicios existentes */}
        <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-8 shadow space-y-6">
          <h2 className="text-2xl font-semibold">Editar Existente</h2>

          {/* Select simulados */}
          <select className="w-full border border-gray-300 rounded-md px-4 py-2">
            <option>Suministros</option>
          </select>
          <select className="w-full border border-gray-300 rounded-md px-4 py-2">
            <option>Suministros</option>
          </select>

          {/* Detalle del servicio seleccionado */}
          <div className="border border-gray-300 rounded-xl p-6 space-y-4">
            <h3 className="text-xl font-semibold">Suministros</h3>

            <div>
              <label htmlFor="titleEdit" className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                id="titleEdit"
                type="text"
                defaultValue="Suministros"
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            </div>

            <div>
              <label htmlFor="descEdit" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                id="descEdit"
                rows={5}
                defaultValue="Lorem ipsum dolor sit amet consectetur adipiscing elit tellus..."
                className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none"
              />
            </div>

            <div>
              <label htmlFor="imgEdit" className="block text-sm font-medium text-gray-700 mb-1">
                Imagen
              </label>
              <input
                id="imgEdit"
                type="text"
                defaultValue="https://www.google.com/imgres?q=bookmgu40gQAA"
                className="w-full border border-gray-300 rounded-md px-4 py-2"
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

export default ServicesEdition
