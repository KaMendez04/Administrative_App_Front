import { Plus } from "lucide-react"

interface PersonalPageHeaderProps {
  onAdd: () => void
}

export function PersonalPageHeader({ onAdd }: PersonalPageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold text-[#374321]">Gestión del Personal</h1>
      <button
        onClick={onAdd}
        className="bg-[#708C3E] hover:bg-[#5e7630] text-white rounded-full w-11 h-11 flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-110"
        aria-label="Agregar nuevo personal"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  )
}
