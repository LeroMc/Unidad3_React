
export function extractErrorMessage(data, fallback = "Ocurrió un error inesperado") {
  if (!data) return fallback

  if (data.errors) {
    const detalles = Object.values(data.errors).flat().filter(Boolean)
    if (detalles.length > 0) {
      return detalles.join(" ")
    }
  }

  return data.message || fallback
}
