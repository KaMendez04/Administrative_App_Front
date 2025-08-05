import { useEffect, useState } from "react"

import type { EventEdition } from "../../models/editionSection/EventEditionType"
import { fetchEvents, updateEvent } from "../../services/EditionSection/EventService"

export function useEvents() {
  const [events, setEvents] = useState<EventEdition[]>([])
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)

  // Evento actualmente seleccionado
  const selectedEvent = events.find((e) => e.id === selectedEventId) ?? null

  // Obtener eventos al montar
  useEffect(() => {
    fetchEvents().then(setEvents).catch(console.error)
  }, [])

  // Crear nuevo evento
  const handleCreate = async (newEvent: Omit<Event, "id">) => {
    try {
      await createEvent(newEvent)
      const updatedEvents = await fetchEvents()
      setEvents(updatedEvents)
    } catch (err) {
      console.error("Error creando evento:", err)
    }
  }

  // Actualizar evento existente
  const handleUpdate = async (updatedEvent: Event) => {
    try {
      await updateEvent(updatedEvent.id, updatedEvent)
      const updatedEvents = await fetchEvents()
      setEvents(updatedEvents)
    } catch (err) {
      console.error("Error actualizando evento:", err)
    }
  }

  // Eliminar evento
  const handleDelete = async (id: number) => {
    try {
      await deleteEvent(id)
      const updatedEvents = await fetchEvents()
      setEvents(updatedEvents)
      setSelectedEventId(null)
    } catch (err) {
      console.error("Error eliminando evento:", err)
    }
  }

  return {
    events,
    selectedEvent,
    selectedEventId,
    setSelectedEventId,
    handleCreate,
    handleUpdate,
    handleDelete,
  }
}
function createEvent(newEvent: Omit<Event, "id">) {
    throw new Error("Function not implemented.")
}

