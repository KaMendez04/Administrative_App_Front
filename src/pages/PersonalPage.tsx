// src/pages/PersonalPage.ts
import { useMemo } from "react"
import { useReactTable, getCoreRowModel } from "@tanstack/react-table"

import type { PersonalPageType } from "../models/PersonalPageType"
import { getPersonalPageList } from "../services/personalPageService"
import { usePersonalPageState } from "../hooks/usePersonalPageState"
import { usePersonalPageColumns } from "../hooks/usePersonalPageColumns"
import { PersonalPageHeader } from "../components/Personal/PersonalPageHeader"
import { PersonalPageSearch } from "../components/Personal/PersonalPageSearch"
import { PersonalPageTable } from "../components/Personal/PersonalPageTable"
import { PersonalPageInfoModal } from "../components/Personal/PersonalPageInfoModal"
import { EditPersonalPageModal } from "../components/Personal/EditPersonalPageModal"



export default function PersonalPage() {
  const personalPageList = getPersonalPageList()

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

  const filtered = useMemo<PersonalPageType[]>(() => {
    return personalPageList.filter((s) =>
      `${s.name} ${s.lastname1} ${s.lastname2} ${s.IDE}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [search, personalPageList])

  const columns = usePersonalPageColumns({
    onView: (item) => setSelectedPersonalPage(item),
    onEdit: (item) => setEditPersonalPage(item),
  })

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

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
        />
      )}

      {newPersonalPage && (
        <EditPersonalPageModal
          personalPage={newPersonalPage}
          setPersonalPage={setNewPersonalPage}
          isNew
        />
      )}
    </div>
  )
}
