// src/pages/PersonalPage.tsx
import { useEffect, useMemo, useState } from "react"
import { useReactTable, getCoreRowModel, getPaginationRowModel } from "@tanstack/react-table"
import type { PersonalPageType } from "../models/PersonalPageType"
import { usePersonalPageState } from "../hooks/usePersonalPageState"
import { usePersonalPageColumns } from "../hooks/usePersonalPageColumns"
import { PersonalPageHeader } from "../components/Personal/PersonalPageHeader"
import { PersonalPageSearch } from "../components/Personal/PersonalPageSearch"
import { PersonalPageTable } from "../components/Personal/PersonalPageTable"
import { PersonalPagePagination } from "../components/Personal/PersonalPagePagination"
import { PersonalPageInfoModal } from "../components/Personal/PersonalPageInfoModal"
import { EditPersonalPageModal } from "../components/Personal/EditPersonalPageModal"
import BackButton from "../components/Personal/BackButton"
import { fetchCedulaData, personalApi } from "../services/personalPageService"

// API -> UI
function mapApiToUi(p: any): PersonalPageType {
  return {
    id: p.id as unknown as number, // si tu UI lo requiere
    IdUser: 0, // opcional solo para UI
    IDE: p.IDE,
    name: p.name,
    lastname1: p.lastname1,
    lastname2: p.lastname2,
    birthDate: p.birthDate,  // <- mapear a UI (minúscula)
    phone: p.phone,
    email: p.email,
    direction: p.direction,
    occupation: p.occupation,
    isActive: true, // si la UI lo usa; el backend actual no lo maneja
  } as unknown as PersonalPageType
}

export default function PersonalPage() {
  // 1) Estado local para datos reales desde API
  const [items, setItems] = useState<PersonalPageType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 2) Estado de la página (buscador, modales, etc.)
  const {
    search,
    setSearch,
    selectedPersonalPage,
    setSelectedPersonalPage,
    editPersonalPage,
    setEditPersonalPage,
    newPersonalPage,
    setNewPersonalPage,
    openNewPersonalPage,
  } = usePersonalPageState()

  // 3) Cargar desde backend al montar
  async function load() {
    try {
      const data = await personalApi.list()
      setItems(data.map(mapApiToUi))
      setError(null)
      setError(null)
    } catch (e: any) {
      setError(e?.message ?? "Error al cargar el personal")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  // 4) Filtro local (como ya lo tenías)
  const filtered = useMemo<PersonalPageType[]>(() => {
    return items.filter((s: any) =>
      `${s.name} ${s.lastname1} ${s.lastname2} ${s.IDE}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [search, items])

  // 5) Columnas (igual que antes)
  const columns = usePersonalPageColumns({
    onView: (item) => setSelectedPersonalPage(item),
    onEdit: (item) => setEditPersonalPage(item),
  })

  // 6) Tabla (igual que antes)
  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize: 6 } },
  })

  const lookupCedula = (id: string) => fetchCedulaData(id);

  const readOnlyStyle =
  "bg-gray-100 text-gray-500 border-dashed border-gray-300 cursor-not-allowed opacity-80 select-none";

  // 7) UI de carga / error mínima
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#FAF9F5] px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="h-6 w-40 bg-gray-200 rounded mb-4 animate-pulse" />
          <div className="h-10 w-full bg-gray-200 rounded mb-6 animate-pulse" />
          <div className="h-96 w-full bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-[#FAF9F5] px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-red-600 font-medium">Error: {error}</p>
          <button
            onClick={load}
            className="mt-3 rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  // 8) Render normal
  return (
    <div className="min-h-screen w-full bg-[#FAF9F5] px-6 py-10 relative">
      <div className="max-w-7xl mx-auto">
        <PersonalPageHeader onAdd={openNewPersonalPage} />

        <div className="mb-8">
          <PersonalPageSearch value={search} onChange={setSearch} />
        </div>

        <div className="overflow-x-auto bg-white rounded-2xl shadow">
          <PersonalPageTable table={table} />
        </div>

        {/* Controles de paginación */}
        <div className="mt-6">
          <PersonalPagePagination table={table} />
          <BackButton />
        </div>
      </div>

      {selectedPersonalPage && (
        <PersonalPageInfoModal
          item={selectedPersonalPage}
          onClose={() => setSelectedPersonalPage(null)}
        />
      )}

      {editPersonalPage && (
        <EditPersonalPageModal
          personalPage={editPersonalPage}
          setPersonalPage={setEditPersonalPage}
          isNew={false}
          onSaved={load}
          lookup={lookupCedula}
        />
      )}

      {newPersonalPage && (
        <EditPersonalPageModal
          personalPage={newPersonalPage}
          setPersonalPage={setNewPersonalPage}
          isNew={true}
          onSaved={load}
          lookup={lookupCedula}
        />
      )}

    </div>
  )
}
