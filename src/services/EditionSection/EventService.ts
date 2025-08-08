import type { EventEdition } from "../../models/editionSection/EventEditionType"
const API_URL = "http://localhost:3000/api/events"

export async function fetchEvents(): Promise<Event[]> {
  const res = await fetch(API_URL)
  return res.json()
}

export async function updateEvent(event: EventEdition, updatedEvent: Event): Promise<void> {
  await fetch(`${API_URL}/${event.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: event.title,
      date: event.date,
      description: event.description,
      illustration: event.illustration,
    }),
  })
}
