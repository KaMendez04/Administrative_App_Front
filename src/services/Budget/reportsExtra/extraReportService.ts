import apiConfig from "../../../apiConfig/apiConfig";

export async function fetchExtraFull(filters:{start?:string;end?:string;name?:string}) {
  const { data } = await apiConfig.get("/report-extra/full", { params: {
    start: filters.start || undefined, 
    end: filters.end || undefined, 
    name: filters.name || undefined
  }});
  return data as {
    rows: {id:number;name?:string;description?:string;date?:string;amount:number;used:number;remaining:number}[];
    totals:{count:number;totalAmount:number;totalUsed:number;totalRemaining:number};
  };
}

// Función simple para descargar PDF
export async function downloadExtraReportPDF(filters: {start?:string;end?:string;name?:string}) {
  const params = new URLSearchParams();
  if (filters.start) params.append('start', filters.start);
  if (filters.end) params.append('end', filters.end);
  if (filters.name) params.append('name', filters.name);

  const baseURL = apiConfig.defaults.baseURL || '';
  const url = `${baseURL}/report-extra/download/pdf?${params.toString()}`;
  
  // Crear link temporal para descargar
  const link = document.createElement('a');
  link.href = url;
  link.download = `reporte-extraordinarios-${new Date().toISOString().slice(0, 10)}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Función simple para vista previa PDF
export function previewExtraReportPDF(filters: {start?:string;end?:string;name?:string}) {
  const params = new URLSearchParams();
  if (filters.start) params.append('start', filters.start);
  if (filters.end) params.append('end', filters.end);
  if (filters.name) params.append('name', filters.name);

  const baseURL = apiConfig.defaults.baseURL || '';
  const url = `${baseURL}/report-extra/preview/pdf?${params.toString()}`;
  window.open(url, '_blank');
}