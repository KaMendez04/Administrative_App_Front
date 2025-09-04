import { useEffect, useMemo, useState } from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel } from "@tanstack/react-table";
import type { PersonalPageType } from "../models/PersonalPageType";
import { usePersonalPageState } from "../hooks/Personal/usePersonalPageState";
import { usePersonalPageColumns } from "../hooks/Personal/usePersonalPageColumns";
import { PersonalPageHeader } from "../components/Personal/PersonalPageHeader";
import { PersonalPageSearch } from "../components/Personal/PersonalPageSearch";
import { PersonalPageTable } from "../components/Personal/PersonalPageTable";
import { PersonalPagePagination } from "../components/Personal/PersonalPagePagination";
import { PersonalPageInfoModal } from "../components/Personal/PersonalPageInfoModal";
import { EditPersonalPageModal } from "../components/Personal/EditPersonalPageModal";
import BackButton from "../components/Personal/BackButton";
import { personalApi } from "../services/personalPageService";
import { fetchCedulaData } from "../services/cedulaService";


import { downloadPDFFromRows } from "../utils/exportUtils";

// API -> UI
function mapApiToUi(p: any): PersonalPageType {
  return {
    id: p.id as unknown as number,
    IdUser: 0,
    IDE: p.IDE,
    name: p.name,
    lastname1: p.lastname1,
    lastname2: p.lastname2,
    birthDate: p.birthDate,
    phone: p.phone,
    email: p.email,
    direction: p.direction,
    occupation: p.occupation,
    isActive: !!p.isActive,
  } as unknown as PersonalPageType;
}

export default function PersonalPage() {
  const [items, setItems] = useState<PersonalPageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  } = usePersonalPageState();

  async function load() {
    try {
      const data = await personalApi.list();
      setItems(data.map(mapApiToUi));
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? "Error al cargar el personal");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo<PersonalPageType[]>(() => {
    return items.filter((s: any) =>
      `${s.name} ${s.lastname1} ${s.lastname2} ${s.IDE}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, items]);

  const columns = usePersonalPageColumns({
    onView: (item) => setSelectedPersonalPage(item),
    onEdit: (item) => setEditPersonalPage(item),
  });

  // Columnas para PDF
  const pdfColumns = [
    { header: "Nombre",           field: "name",       width: 100 },
    { header: "Primer Apellido",  field: "lastname1",  width: 110 },
    { header: "Segundo Apellido", field: "lastname2",  width: 110 },
    { header: "Cédula",           field: "IDE",        width: 100 },
    { header: "Teléfono",         field: "phone",      width: 100 },
    { header: "Puesto",           field: "occupation", width: 120 },
    { header: "Email",            field: "email",      width: 170 },
  ];

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize: 6 } },
  });

  const lookupCedula = (id: string) => fetchCedulaData(id);

  //  Exportar PDF
  const handleExportPDF = () => {
    downloadPDFFromRows("personal_filtrado.pdf", filtered as any[], pdfColumns, {
      title: "Cámara de Ganaderos — Personal",
      filterText: search.trim() || "Sin filtro",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#FAF9F5] px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="h-6 w-40 bg-gray-200 rounded mb-4 animate-pulse" />
          <div className="h-10 w-full bg-gray-200 rounded mb-6 animate-pulse" />
          <div className="h-96 w-full bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-[#FAF9F5] px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-red-600 font-medium">Error: {error}</p>
          <button onClick={load} className="mt-3 rounded-lg border px-4 py-2 hover:bg-gray-50">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF9F5] px-6 py-10 relative">
      <div className="max-w-7xl mx-auto">
        <PersonalPageHeader onAdd={openNewPersonalPage} />

        {/* Buscador */}
        <div className="mb-6">
          <PersonalPageSearch value={search} onChange={setSearch} />
        </div>

        {/* Toolbar con PDF */}
        <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end">
          <button
            onClick={handleExportPDF}
            className="rounded-lg border border-[#A3853D] px-4 py-2 text-[#2E321B] bg-white hover:bg-[#FAF1DF] transition"
            title="Descargar PDF con los registros filtrados"
          >
            Exportar PDF
          </button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto bg-white rounded-2xl shadow">
          <PersonalPageTable table={table} />
        </div>

        {/* Paginación */}
        <div className="mt-6">
          <PersonalPagePagination table={table} />
          <BackButton />
        </div>
      </div>

      {selectedPersonalPage && (
        <PersonalPageInfoModal item={selectedPersonalPage} onClose={() => setSelectedPersonalPage(null)} />
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
  );
}
