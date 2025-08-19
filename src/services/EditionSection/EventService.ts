import apiConfig from "../apiConfig";
import type { EventEdition, EventInput } from "../../models/editionSection/EventEditionType";

// GET /event
export async function fetchEvents(): Promise<EventEdition[]> {
  const { data } = await apiConfig.get<EventEdition[]>("/event");
  return data;
}

// POST /event  (date en 'YYYY-MM-DD')
export async function createEvent(input: EventInput): Promise<EventEdition> {
  const { data } = await apiConfig.post<EventEdition>("/event", input);
  return data;
}

// PUT /event/:id  
export async function updateEvent(id: number, input: EventInput) {
  const { data } = await apiConfig.put(`/event/${id}`, input);
  return data;
}

// DELETE /event/:id
export async function deleteEvent(id: number) {
  const { data } = await apiConfig.delete(`/event/${id}`);
  return data;
}
