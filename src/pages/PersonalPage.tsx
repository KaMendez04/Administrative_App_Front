// src/pages/PersonalPage.tsx
import { useEffect, useMemo, useState } from "react";
import { usePersonalPageState } from "../hooks/Personal/usePersonalPageState";
import { PersonalPageHeader } from "../components/Personal/PersonalPageHeader";
import { PersonalPageSearch } from "../components/Personal/PersonalPageSearch";
import { PersonalPageInfoModal } from "../components/Personal/PersonalPageInfoModal";
import { EditPersonalPageModal } from "../components/Personal/EditPersonalPageModal";
import { personalApi } from "../services/personalPageService";
import { fetchCedulaData } from "../services/cedulaService";
import { getCurrentUser } from "../auth/auth";
import type { PersonalPageType } from "../models/PersonalPageType";
import { PersonalTable } from "../components/Personal/PersonalPageTable";
import { ActionButtons } from "../components/ActionButtons";
import { useNavigate } from "@tanstack/react-router";

// ===== API -> UI (incluye fechas laborales) =====
function mapApiToUi(p: any): PersonalPageType {
  return {
    IdUser: p.IdUser ?? p.id ?? 0,
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
    startWorkDate: p.startWorkDate ?? "",
    endWorkDate: p.endWorkDate ?? null,
  };
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
  const navigate = useNavigate();
  
  // Rol (solo JUNTA es read-only)
  const role = getCurrentUser()?.role?.name?.toUpperCase();
  const isReadOnly = role === "JUNTA";

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

  const filtered = useMemo(() => {
    return items.filter((s: any) =>
      `${s.name} ${s.lastname1} ${s.lastname2} ${s.IDE}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, items]);


  const lookupCedula = (id: string) => fetchCedulaData(id);


  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando…</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen w-full bg-[#FAF9F5] px-6 py-10 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header: solo ADMIN ve botón Agregar */}
        {!isReadOnly && <PersonalPageHeader onAdd={openNewPersonalPage} />}

        <div className="mb-6">
          <PersonalPageSearch value={search} onChange={setSearch} />
        </div>


        {/* Tabla Reutilizable */}
        <PersonalTable
          data={filtered}
          isLoading={false}
          isReadOnly={isReadOnly}
          onView={setSelectedPersonalPage}
          onEdit={(item) => {
            if (!isReadOnly) setEditPersonalPage(item);
          }}
        />

        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-[#556B2F] font-medium">
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          </div>
          <ActionButtons
            onBack={() => navigate({ to: "/Principal" })}
            showBack={true}
            backText="Regresar"
            showText={true}
          />   
        </div>
      </div>

      {selectedPersonalPage && (
        <PersonalPageInfoModal
          item={selectedPersonalPage}
          onClose={() => setSelectedPersonalPage(null)}
        />
      )}

      {/* Editar y Nuevo solo para ADMIN */}
      {!isReadOnly && editPersonalPage && (
        <EditPersonalPageModal
          personalPage={editPersonalPage}
          setPersonalPage={setEditPersonalPage}
          isNew={false}
          onSaved={load}
          lookup={lookupCedula}
        />
      )}

      {!isReadOnly && newPersonalPage && (
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