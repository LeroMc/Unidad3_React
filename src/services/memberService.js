import { getToken } from "./authService"
import { extractErrorMessage } from "./apiError"

const BASE = "http://localhost:3000/api/member"

function getHeaders() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }
}

export async function getAvailableClasses() {
  const res = await fetch(`${BASE}/classes`, { headers: getHeaders() })
  const data = await res.json()
  if (!res.ok) throw new Error(extractErrorMessage(data, "Error al obtener clases"))
  return data.data || data
}

export async function getClassDetail(id) {
  const res = await fetch(`${BASE}/classes/${id}`, { headers: getHeaders() })
  const data = await res.json()
  if (!res.ok) throw new Error(extractErrorMessage(data, "Error al obtener detalle"))
  return data.data || data
}

export async function getMemberDashboard() {
  const res = await fetch(`${BASE}/dashboard`, { headers: getHeaders() })
  const data = await res.json()
  if (!res.ok) throw new Error(extractErrorMessage(data, "Error al obtener dashboard"))
  return data.data || data
}
