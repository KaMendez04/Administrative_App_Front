import { useEffect } from "react";


import ProjectionHeader from "../../components/Budget/Projection/ProjectionHeader";
import ProjectionTable from "../../components/Budget/Projection/ProjectionTable";
import { useProjection } from "../../hooks/Budget/useProjection";


type Props = {
  year?: number;
  title?: string;
};

export default function ProjectionSectionPage({ year, title = "Proyección" }: Props) {
  const {
    // estado
    budgetYear,
    rows,
    loading,
    savingId,
    editValues,
    projection,
    totalCalculated,

    // helpers
    colones,

    // handlers/setters
    setBudgetYear,
    setEditValues,
    startEdit,
    cancelEdit,
    saveEdit,
  } = useProjection(year);

  useEffect(() => {
    (window as any).__setProjectionEditValues = setEditValues;
    return () => {
      delete (window as any).__setProjectionEditValues;
    };
  }, [setEditValues]);

  return (
    <div className="w-full px-6 lg:px-12 xl:px-20 max-w-7xl mx-auto">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-md p-6 lg:p-8">
        {/* Header */}
        <ProjectionHeader
          title={title}
          budgetYear={budgetYear}
          setBudgetYear={setBudgetYear}
          totalCalculated={totalCalculated}
          colones={colones}
        />

        {/* Tabla */}
        <ProjectionTable
          rows={rows}
          loading={loading}
          savingId={savingId}
          editValues={editValues}
          totalCalculated={totalCalculated}
          colones={colones}
          startEdit={startEdit}
          cancelEdit={cancelEdit}
          saveEdit={saveEdit}
          canSave={!!projection}
        />

      </div>
    </div>
  );
}
