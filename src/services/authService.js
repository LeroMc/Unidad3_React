import { extractErrorMessage } from "./apiError"

const API_URL = "http://localhost:3000/api/auth"

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  }
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(extractErrorMessage(data, "Error al iniciar sesión"))
  }

  return data
}

export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(extractErrorMessage(data, "Error al registrar el usuario"))
  }

  return data
}

export async function getMe() {
  const response = await fetch(`${API_URL}/me`, {
    method: "GET",
    headers: getHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(extractErrorMessage(data, "No se pudo obtener el perfil"))
  }

  return data
}

export async function updateMe(payload) {
  const response = await fetch(`${API_URL}/me`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(extractErrorMessage(data, "Error al actualizar el perfil"))
  }

  return data
}

export async function changeMyPassword({ current_password, new_password, confirm_password }) {
  const response = await fetch(`${API_URL}/me/password`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ current_password, new_password, confirm_password }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(extractErrorMessage(data, "Error al actualizar la contraseña"))
  }

  return data
}

export function saveSession(token, user) {
  localStorage.setItem("token", token)
  localStorage.setItem("user", JSON.stringify(user))
}

export function getToken() {
  return localStorage.getItem("token")
}

export function getUser() {
  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
}

export function updateStoredUser(user) {
  localStorage.setItem("user", JSON.stringify(user))
}

export function isAuthenticated() {
  return Boolean(getToken())
}

export function logout() {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}
