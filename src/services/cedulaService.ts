import axios from "axios";

// Lo que devuelve cada item de la API (ajústalo si necesitas más campos)
export interface CedulaRecord {
  fullname: string;
  [k: string]: any;
}

// Lo que devuelve la API en /cedulas/:id
interface CedulaAPIResponse {
  results?: CedulaRecord[];
}

// Instancia para la API externa
const external = axios.create({
  baseURL: "https://apis.gometa.org",
  timeout: 8000,
});

export async function fetchCedulaData(cedula: string): Promise<CedulaRecord> {
  const { data } = await external.get<CedulaAPIResponse>(
    `/cedulas/${encodeURIComponent(cedula)}`
  );

  const results = data?.results ?? [];
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error("Sin resultados");
  }

  const persona = results[0];

  if (
    typeof persona?.fullname === "string" &&
    persona.fullname.toUpperCase().includes("NO REGISTRADA")
  ) {
    throw new Error("Cédula no registrada");
  }

  return persona;
}
