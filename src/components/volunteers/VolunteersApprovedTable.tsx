import { Users, Mail, Phone, Calendar, ToggleLeft, ToggleRight, Eye } from "lucide-react";
import type { VoluntarioIndividual } from "../../schemas/volunteerSchemas";

interface VolunteersApprovedTableProps {
  data: VoluntarioIndividual[];
  isLoading: boolean;
  onView: (id: number) => void;
  onToggleStatus: (id: number) => void;
  isTogglingStatus?: boolean;
}

export function VolunteersApprovedTable({
  data,
  isLoading,
  onView,
  onToggleStatus,
  isTogglingStatus,
}: VolunteersApprovedTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5B732E]"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No se encontraron voluntarios</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F8F9F3] border-b-2 border-[#E5E7EB]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-[#5B732E] uppercase tracking-wider">
                Voluntario
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-[#5B732E] uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-[#5B732E] uppercase tracking-wider">
                Nacionalidad
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-[#5B732E] uppercase tracking-wider">
                Fecha Registro
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-[#5B732E] uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-[#5B732E] uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((voluntario) => {
              const persona = voluntario.persona;
              const nombreCompleto = `${persona.nombre} ${persona.apellido1} ${persona.apellido2}`;

              return (
                <tr
                  key={voluntario.idVoluntario}
                  className="hover:bg-gray-50 transition"
                >
                  {/* Voluntario */}
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {nombreCompleto}
                      </div>
                      <div className="text-sm text-gray-500">
                        Cédula: {persona.cedula}
                      </div>
                    </div>
                  </td>

                  {/* Contacto */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {persona.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {persona.telefono}
                      </div>
                    </div>
                  </td>

                  {/* Nacionalidad */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">
                      {voluntario.nacionalidad}
                    </span>
                  </td>

                  {/* Fecha Registro */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {new Date(voluntario.createdAt).toLocaleDateString()}
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        voluntario.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {voluntario.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onView(voluntario.idVoluntario)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Ver detalles"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onToggleStatus(voluntario.idVoluntario)}
                        disabled={isTogglingStatus}
                        className={`p-2 rounded-lg transition ${
                          voluntario.isActive
                            ? "text-orange-600 hover:bg-orange-50"
                            : "text-green-600 hover:bg-green-50"
                        } disabled:opacity-50`}
                        title={
                          voluntario.isActive ? "Desactivar" : "Activar"
                        }
                      >
                        {voluntario.isActive ? (
                          <ToggleRight className="w-5 h-5" />
                        ) : (
                          <ToggleLeft className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}