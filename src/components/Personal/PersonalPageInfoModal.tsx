import type { PersonalPageType } from "../../models/PersonalPageType"


interface PersonalPageInfoModalProps {
  item: PersonalPageType
  onClose: () => void
}

export function PersonalPageInfoModal({ item, onClose }: PersonalPageInfoModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold text-[#374321] mb-4">Información adicional</h2>

        <p>
          <span className="font-semibold">Nombre completo:</span>{" "}
          {item.name} {item.lastname1} {item.lastname2}
        </p>

        <p>
          <span className="font-semibold">Cédula:</span> {item.IDE}
        </p>

        <p>
          <span className="font-semibold">Fecha de nacimiento:</span> {item.birthdate}
        </p>

        <p>
          <span className="font-semibold">Ubicación:</span> {item.direction}
        </p>

        {item.email && (
          <p>
            <span className="font-semibold">Correo:</span> {item.email}
          </p>
        )}

        <p className="mt-2">
          <span className="font-semibold">Estado:</span>{" "}
          <span
            className={`ml-1 px-3 py-1.5 rounded-full text-sm font-semibold ${
              item.isActive ? "bg-green-100 text-[#4D7031]" : "bg-red-100 text-red-700"
            }`}
          >
            {item.isActive ? "Activo" : "Inactivo"}
          </span>
        </p>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#708C3E] hover:bg-[#5e7630] text-white rounded-md shadow"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
