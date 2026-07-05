import { getToken } from "./authService"
import { extractErrorMessage } from "./apiError"

const API_URL = "http://localhost:3000/api/class-schedules"

function getHeaders() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }
}

export async function getSchedules() {
  const res = await fetch(API_URL, { headers: getHeaders() })
  const data = await res.json()
  if (!res.ok) throw new Error(extractErrorMessage(data, "Error al obtener horarios"))
  return data.data || data
}

export async function createSchedule(payload) {
  const res = await fetch(API_URL, { method: "POST", headers: getHeaders(), body: JSON.stringify(payload) })
  const data = await res.json()
  if (!res.ok) throw new Error(extractErrorMessage(data, "Error al crear horario"))
  return data
}

export async function updateSchedule(id, payload) {
  const res = await fetch(`${API_URL}/${id}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(payload) })
  const data = await res.json()
  if (!res.ok) throw new Error(extractErrorMessage(data, "Error al actualizar horario"))
  return data
}

export async function deleteSchedule(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE", headers: getHeaders() })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(extractErrorMessage(data, "Error al eliminar horario"))
  return true
}
