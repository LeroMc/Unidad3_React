import { getToken } from "./authService"
import { extractErrorMessage } from "./apiError"

const API_URL = "http://localhost:3000/api/sport-rooms"

function getHeaders() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }
}

export async function getSportRooms() {
  const res = await fetch(API_URL, { headers: getHeaders() })
  const data = await res.json()
  if (!res.ok) throw new Error(extractErrorMessage(data, "Error al obtener asignaciones"))
  return data.data || data
}

export async function createSportRoom(payload) {
  const res = await fetch(API_URL, { method: "POST", headers: getHeaders(), body: JSON.stringify(payload) })
  const data = await res.json()
  if (!res.ok) throw new Error(extractErrorMessage(data, "Error al crear asignación"))
  return data
}

export async function updateSportRoom(id, payload) {
  const res = await fetch(`${API_URL}/${id}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(payload) })
  const data = await res.json()
  if (!res.ok) throw new Error(extractErrorMessage(data, "Error al actualizar asignación"))
  return data
}

export async function deleteSportRoom(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE", headers: getHeaders() })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(extractErrorMessage(data, "Error al eliminar asignación"))
  return true
}
