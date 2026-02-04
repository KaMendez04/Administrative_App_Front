import { useMemo } from "react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { GenericTable } from "../GenericTable";
import type { SolicitudVoluntariadoListResponse } from "../../schemas/volunteerSchemas";
import { ActionButtons } from "../ActionButtons";

type SolicitudVoluntariadoListItem = SolicitudVoluntariadoListResponse['items'][number];

interface VolunteerRequestsTableProps {
  data: SolicitudVoluntariadoListItem[];
  isLoading: boolean;
  isReadOnly: boolean;
  onView: (id: number) => void;
  onApprove: (solicitud: SolicitudVoluntariadoListItem) => void | Promise<void>;
  onReject: (id: number) => void;
  approvingId: number | null;
}

export function VolunteerRequestsTable({
  data,
  isLoading,
  isReadOnly,
  onView,
  onApprove,
  onReject,
  approvingId,
}: VolunteerRequestsTableProps) {
  const columnHelper = createColumnHelper<SolicitudVoluntariadoListItem>();

  const columns: ColumnDef<SolicitudVoluntariadoListItem, any>[] = useMemo(
    () => [
      columnHelper.accessor("tipoSolicitante", {
        header: "Tipo",
        size: 120,
        cell: (info) => {
          const isIndividual = info.getValue() === "INDIVIDUAL";
          return (
            <span
              className={`justify-center items-center flex px-2 py-1 rounded-lg text-xs font-bold ${
                isIndividual
                  ? "bg-[#D4E8E0] text-[#2D5F4F]"
                  : "bg-[#F5E6C5] text-[#8B6C2E]"
              }`}
            >
              {info.getValue()}
            </span>
          );
        },
      }),
      columnHelper.accessor(
        (row) => {
          const isIndividual = row.tipoSolicitante === "INDIVIDUAL";
          return isIndividual
            ? `${row.voluntario?.persona.nombre} ${row.voluntario?.persona.apellido1}`
            : row.organizacion?.nombre;
        },
        {
          id: "solicitante",
          header: "Solicitante",
          size: 200,
          cell: (info) => (
            <div className="font-medium text-[#33361D] truncate" title={info.getValue()}>
              {info.getValue() || "N/A"}
            </div>
          ),
        }
      ),
      columnHelper.accessor(
        (row) => {
          const isIndividual = row.tipoSolicitante === "INDIVIDUAL";
          return isIndividual
            ? row.voluntario?.persona.cedula
            : row.organizacion?.cedulaJuridica;
        },
        {
          id: "identificacion",
          header: "Identificación",
          size: 120,
          cell: (info) => (
            <div className="font-medium text-[#33361D]">
              {info.getValue() || "—"}
            </div>
          ),
        }
      ),
      columnHelper.accessor(
        (row) => {
          const isIndividual = row.tipoSolicitante === "INDIVIDUAL";
          return isIndividual
            ? row.voluntario?.persona.email
            : row.organizacion?.email;
        },
        {
          id: "email",
          header: "Email",
          size: 180,
          cell: (info) => (
            <div className="text-[#33361D] truncate" title={info.getValue()}>
              {info.getValue() || "—"}
            </div>
          ),
        }
      ),
      columnHelper.accessor("estado", {
        header: "Estado",
        size: 100,
        cell: (info) => {
          const colorMap: Record<'PENDIENTE' | 'APROBADO' | 'RECHAZADO', string> = {
            PENDIENTE: "bg-yellow-100 text-yellow-800",
            APROBADO: "bg-[#E6EDC8] text-[#5A7018]",
            RECHAZADO: "bg-[#F7E9E6] text-[#8C3A33]",
          };
          const estado = info.getValue() as keyof typeof colorMap;

          return (
            <span
              className={`justify-center items-center flex px-2 py-1 rounded-lg text-xs font-bold ${colorMap[estado]}`}
            >
              {estado}
            </span>
          );
        },
      }),
      columnHelper.accessor("fechaSolicitud", {
        header: "Fecha",
        size: 100,
        cell: (info) => {
          const date = new Date(info.getValue());
          return (
            <div className="text-[#33361D]">
              {new Intl.DateTimeFormat("es-CR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                timeZone: "UTC"  
              }).format(date)}
            </div>
          );
        },
      }),
      columnHelper.display({
        id: "acciones",
        header: () => <div className="text-center">Acciones</div>,
        size: 150,
        cell: (info) => {
          const estado = info.row.original.estado;
          const solicitud = info.row.original;
          const solicitudId = solicitud.idSolicitudVoluntariado;
          const isThisApproving = approvingId === solicitudId;

          const canApprove = (estado === "PENDIENTE" || estado === "RECHAZADO") && !isReadOnly;
          const canReject = (estado === "PENDIENTE") && !isReadOnly; // ✅ SOLO pendientes

          return (
            <ActionButtons
              onView={() => onView(solicitudId)}
              onApprove={canApprove ? () => onApprove(solicitud) : undefined}
              onReject={canReject ? () => onReject(solicitudId) : undefined} // ✅ RECHAZADO => undefined
              showApproveReject={canApprove || canReject}
              isApproving={isThisApproving}
              isReadOnly={isReadOnly}
            />
          );
        },
      }),
    ],
    [isReadOnly, approvingId, onView, onApprove, onReject]
  );

  return <GenericTable data={data} columns={columns} isLoading={isLoading} />;
}