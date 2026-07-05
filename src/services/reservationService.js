import { getToken } from "./authService"
import { extractErrorMessage } from "./apiError"

const API_URL = "http://localhost:3000/api/reservations"

function getHeaders() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }
}

export async function getMyReservations() {
  const res = await fetch(`${API_URL}/my-reservations`, { headers: getHeaders() })
  const data = await res.json()
  if (!res.ok) throw new Error(extractErrorMessage(data, "Error al obtener reservas"))
  return data.data || data
}

export async function createReservation(class_schedule_id, observation = "") {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ class_schedule_id, ...(observation ? { observation } : {}) }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(extractErrorMessage(data, "Error al crear reserva"))
  return data
}

export async function cancelReservation(id) {
  const res = await fetch(`${API_URL}/${id}/cancel`, { method: "PATCH", headers: getHeaders() })
  const data = await res.json()
  if (!res.ok) throw new Error(extractErrorMessage(data, "Error al cancelar reserva"))
  return data
}
