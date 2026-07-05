import { getToken } from "./authService"
import { extractErrorMessage } from "./apiError"

const API_URL = "http://localhost:3000/api/rooms"

function getHeaders() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }
}

export async function getRooms() {
  const res = await fetch(API_URL, { headers: getHeaders() })
  const data = await res.json()
  if (!res.ok) throw new Error(extractErrorMessage(data, "Error al obtener salas"))
  return data.data || data
}

export async function createRoom(payload) {
  const res = await fetch(API_URL, { method: "POST", headers: getHeaders(), body: JSON.stringify(payload) })
  const data = await res.json()
  if (!res.ok) throw new Error(extractErrorMessage(data, "Error al crear sala"))
  return data
}

export async function updateRoom(id, payload) {
  const res = await fetch(`${API_URL}/${id}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(payload) })
  const data = await res.json()
  if (!res.ok) throw new Error(extractErrorMessage(data, "Error al actualizar sala"))
  return data
}

export async function deleteRoom(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE", headers: getHeaders() })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(extractErrorMessage(data, "Error al eliminar sala"))
  return true
}
