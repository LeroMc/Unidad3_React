import { getToken } from "./authService"
import { extractErrorMessage } from "./apiError"

const BASE = "http://localhost:3000/api/coach"

function getHeaders() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }
}

export async function getMyClasses() {
  const res = await fetch(`${BASE}/my-classes`, { headers: getHeaders() })
  const data = await res.json()
  if (!res.ok) throw new Error(extractErrorMessage(data, "Error al obtener clases"))
  return data.data || data
}

export async function getMySchedules() {
  const res = await fetch(`${BASE}/my-schedules`, { headers: getHeaders() })
  const data = await res.json()
  if (!res.ok) throw new Error(extractErrorMessage(data, "Error al obtener horarios"))
  return data.data || data
}

export async function getCoachDashboard() {
  const res = await fetch(`${BASE}/dashboard`, { headers: getHeaders() })
  const data = await res.json()
  if (!res.ok) throw new Error(extractErrorMessage(data, "Error al obtener dashboard"))
  return data.data || data
}
