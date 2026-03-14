import apiConfig from "../../../apiConfig/apiConfig";

type ExtraFilters = {
  start?: string;
  end?: string;
  name?: string;
};

export async function fetchExtraFull(filters: ExtraFilters) {
  const { data } = await apiConfig.get("/report-extra/full", {
    params: {
      start: filters.start || undefined,
      end: filters.end || undefined,
      name: filters.name || undefined,
    },
  });

  return data as {
    rows: {
      id: number;
      name?: string;
      description?: string;
      date?: string;
      amount: number;
      used: number;
      remaining: number;
    }[];
    totals: {
      count: number;
      totalAmount: number;
      totalUsed: number;
      totalRemaining: number;
    };
  };
}

export async function downloadExtraReportPDF(filters: ExtraFilters) {
  const response = await apiConfig.get("/report-extra/download/pdf", {
    params: {
      start: filters.start || undefined,
      end: filters.end || undefined,
      name: filters.name || undefined,
    },
    responseType: "blob",
  });

  const blob = new Blob([response.data as BlobPart], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `reporte-extraordinarios-${new Date().toISOString().slice(0, 10)}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);
}

export async function previewExtraReportPDF(filters: ExtraFilters) {
  const response = await apiConfig.get("/report-extra/preview/pdf", {
    params: {
      start: filters.start || undefined,
      end: filters.end || undefined,
      name: filters.name || undefined,
    },
    responseType: "blob",
  });

  const blob = new Blob([response.data as BlobPart], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);

  window.open(url, "_blank");

  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 3000);
}