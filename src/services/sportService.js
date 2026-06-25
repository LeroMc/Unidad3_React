const API_URL = "http://localhost:3000/api/sports";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const getSports = async (status) => {
  let url = API_URL;
  if (status !== undefined) {
    url += `?status=${status}`;
  }
  const response = await fetch(url, {
    headers: getHeaders()
  });
  if (!response.ok) {
    throw new Error("No se pudo obtener el listado de deportes.");
  }
  const result = await response.json();
  return result.data || result; 
};

export const createSport = async (sportData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(sportData)
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al crear el deporte.");
  }
  return response.json();
};

export const updateSport = async (id, sportData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(sportData)
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al actualizar el deporte.");
  }
  return response.json();
};

export const deleteSport = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  });
  if (!response.ok) {
    throw new Error("No se pudo eliminar el deporte seleccionado.");
  }
  return response.json();
};

export const changeSportStatus = async (id, status) => {
  const response = await fetch(`${API_URL}/${id}/status`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ status })
  });
  if (!response.ok) {
    throw new Error("No se pudo actualizar el estado en el servidor.");
  }
  return response.json();
};