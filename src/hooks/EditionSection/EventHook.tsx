import { useEffect, useState } from "react"

import type { EventEdition, EventInput } from "../../models/editionSection/EventEditionType"
import { fetchEvents, createEvent, updateEvent, deleteEvent } from "../../services/EditionSection/EventService"

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
  const handleCreate = async (newEvent: EventInput) => {
    try {
      await createEvent(newEvent)
      const updated = await fetchEvents()
      setEvents(updated)
    } catch (err) {
      console.error("Error creando evento:", err)
    }
  }

  // Actualizar evento existente
  const handleUpdate = async (updatedEvent: EventEdition) => {
    try {
      const { id, ...input } = updatedEvent
      await updateEvent(id, input)
      const updated = await fetchEvents()
      setEvents(updated)
    } catch (err) {
      console.error("Error actualizando evento:", err)
    }
  }

  // Eliminar evento
  const handleDelete = async (id: number) => {
    try {
      await deleteEvent(id)
      const updated = await fetchEvents()
      setEvents(updated)
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
