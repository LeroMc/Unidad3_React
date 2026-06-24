import { getToken } from "./authService"
import { extractErrorMessage } from "./apiError"

const API_URL = "http://localhost:3000/api/users"

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  }
}

export async function getUsers() {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(extractErrorMessage(data, "Error al obtener usuarios"))
  }

  return data
}

export async function createUser(userData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(userData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(extractErrorMessage(data, "Error al crear usuario"))
  }

  return data
}

export async function updateUser(id, userData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(userData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(extractErrorMessage(data, "Error al actualizar usuario"))
  }

  return data
}

export async function deleteUser(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(extractErrorMessage(data, "Error al eliminar usuario"))
  }

  return true
}
