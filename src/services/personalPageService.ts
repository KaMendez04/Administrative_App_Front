// src/services/personalPageService.ts
import apiConfig from "./apiConfig";
import type { PersonalPageType } from "../models/PersonalPageType";

type CreatePayload = Omit<PersonalPageType, "id">;
type UpdatePayload = Partial<PersonalPageType>;

// Fecha local 'YYYY-MM-DD' (evita desfases por zona horaria)
const todayLocalISO = () => {
  const now = new Date();
  const tz = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - tz).toISOString().slice(0, 10);
};

// Quita claves con undefined (JSON las omite, pero así evitamos ruido)
const cleanUndefined = <T extends Record<string, any>>(obj: T): T => {
  const out: Record<string, any> = {};
  for (const k in obj) {
    if (obj[k] !== undefined) out[k] = obj[k];
  }
  return out as T;
};

// Normalización para CREATE
const normalizeCreate = (p: CreatePayload) => {
  const body: any = { ...p };

  // El back no necesita estos al crear (por si vinieran)
  delete body.id;
  delete body.IdUser;

  // startWorkDate: si viene "", no enviar
  if (typeof body.startWorkDate === "string" && body.startWorkDate.trim() === "") {
    delete body.startWorkDate;
  }

  // endWorkDate depende de isActive
  if (body.isActive === true) {
    body.endWorkDate = null;
  } else {
    // inactivo: si no viene o viene "", poner hoy
    if (
      body.endWorkDate == null ||
      (typeof body.endWorkDate === "string" && body.endWorkDate.trim() === "")
    ) {
      body.endWorkDate = todayLocalISO();
    } else if (typeof body.endWorkDate === "string") {
      body.endWorkDate = body.endWorkDate.trim();
    }
  }

  return cleanUndefined(body);
};

// Normalización para UPDATE
const normalizeUpdate = (p: UpdatePayload) => {
  const body: any = { ...p };

  // No se actualizan identificadores por tu regla
  delete body.IDE;
  delete body.name;
  delete body.lastname1;
  delete body.lastname2;

  // No enviar estos
  delete body.id;
  delete body.IdUser;

  // startWorkDate: si viene "", no enviar
  if (typeof body.startWorkDate === "string" && body.startWorkDate.trim() === "") {
    delete body.startWorkDate;
  }

  // endWorkDate: solo forzamos si se provee isActive en el update
  if (typeof body.isActive === "boolean") {
    if (body.isActive === true) {
      body.endWorkDate = null;
    } else {
      if (
        body.endWorkDate == null ||
        (typeof body.endWorkDate === "string" && body.endWorkDate.trim() === "")
      ) {
        body.endWorkDate = todayLocalISO();
      } else if (typeof body.endWorkDate === "string") {
        body.endWorkDate = body.endWorkDate.trim();
      }
    }
  } else {
    // si no viene isActive, respetamos endWorkDate tal como venga (o la omitimos si "")
    if (typeof body.endWorkDate === "string" && body.endWorkDate.trim() === "") {
      delete body.endWorkDate;
    }
  }

  return cleanUndefined(body);
};

export const personalApi = {
  // GET /personal
  async list(): Promise<PersonalPageType[]> {
    const { data } = await apiConfig.get<PersonalPageType[]>("/personal");
    return data;
  },

  // POST /personal
  async create(payload: CreatePayload): Promise<PersonalPageType> {
    const body = normalizeCreate(payload);
    const { data } = await apiConfig.post<PersonalPageType>("/personal", body);
    return data;
  },

  // PUT /personal/:id
  async update(id: number, payload: UpdatePayload): Promise<PersonalPageType> {
    const body = normalizeUpdate(payload);
    const { data } = await apiConfig.put<PersonalPageType>(`${"/personal"}/${id}`, body);
    return data;
  },

  // DELETE /personal/:id
  async remove(id: number): Promise<void> {
    await apiConfig.delete(`${"/personal"}/${id}`);
  },
};

export async function listPersonalPages(): Promise<PersonalPageType[]> {
  const { data } = await apiConfig.get<PersonalPageType[]>("/personal");
  return data;
}

export async function getPersonalPdfBlob(id: number): Promise<Blob> {
  const res = await apiConfig.get<Blob>(`/personal/pdf/${id}`, {
    responseType: "blob",
  })
  return res.data
}