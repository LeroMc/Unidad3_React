/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react"
import { Badge, Button, Card, Spinner, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import { getRooms, createRoom, updateRoom, deleteRoom } from "../../services/roomService"
import RoomFormModal from "../../components/rooms/RoomFormModal"

function RoomsPage() {
  const [rooms, setRooms]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [showModal, setShowModal]   = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)

  const safeLoad = async () => {
    setLoading(true)
    try {
      const data = await getRooms()
      setRooms(Array.isArray(data) ? data : [])
    } catch (err) { Swal.fire({ icon: "error", title: "Error", text: err.message }) }
    finally { setLoading(false) }
  }

  useEffect(() => { safeLoad() }, [])

  const openCreate = () => { setSelectedRoom(null); setShowModal(true) }
  const openEdit   = (r) => { setSelectedRoom(r);   setShowModal(true) }
  const closeModal = ()  => { setShowModal(false);  setSelectedRoom(null) }

  const handleSave = async (payload) => {
    try {
      if (selectedRoom) {
        await updateRoom(selectedRoom.id, payload)
        Swal.fire({ icon: "success", title: "Actualizado", text: "Sala actualizada correctamente.", timer: 1800, showConfirmButton: false })
      } else {
        await createRoom(payload)
        Swal.fire({ icon: "success", title: "Creado", text: "Sala creada correctamente.", timer: 1800, showConfirmButton: false })
      }
      closeModal(); safeLoad()
    } catch (err) { Swal.fire({ icon: "error", title: "Error", text: err.message }) }
  }

  const handleDelete = async (room) => {
    const res = await Swal.fire({
      title: "¿Eliminar sala?", text: `Se eliminará "${room.name}".`,
      icon: "warning", showCancelButton: true,
      confirmButtonColor: "#d33", confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar",
    })
    if (res.isConfirmed) {
      try {
        await deleteRoom(room.id)
        Swal.fire({ icon: "success", title: "Eliminado", timer: 1500, showConfirmButton: false })
        safeLoad()
      } catch (err) { Swal.fire({ icon: "error", title: "Error", text: err.message }) }
    }
  }

  return (
    <main className="container-fluid py-4">
      <Card className="shadow-sm">
        <Card.Header className="admin-card-header d-flex justify-content-between align-items-center py-3">
          <h4 className="mb-0">🏟️ Gestión de Salas</h4>
          <div className="d-flex gap-2">
            <Button variant="light" onClick={safeLoad} disabled={loading}>
              {loading ? <Spinner size="sm" animation="border" /> : "🔄 Refrescar"}
            </Button>
            <Button variant="warning" className="text-dark fw-semibold" onClick={openCreate}>
              ➕ Nueva Sala
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" style={{ color: "rgb(191,44,44)" }} />
              <p className="mt-2 text-muted">Cargando salas...</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="alert alert-info text-center">No hay salas registradas.</div>
          ) : (
            <Table striped hover responsive className="mb-0">
              <thead className="table-dark">
                <tr><th>ID</th><th>Nombre</th><th>Descripción</th><th>Capacidad</th><th>Ubicación</th><th>Estado</th><th className="text-end">Acciones</th></tr>
              </thead>
              <tbody>
                {rooms.map((r) => (
                  <tr key={r.id}>
                    <td><strong>#{r.id}</strong></td>
                    <td className="fw-semibold">{r.name}</td>
                    <td><span className="text-muted small">{r.description}</span></td>
                    <td>{r.capacity} personas</td>
                    <td>{r.location || "—"}</td>
                    <td><Badge bg={r.status ? "success" : "danger"}>{r.status ? "Activa" : "Inactiva"}</Badge></td>
                    <td className="text-end">
                      <Button className="btn-admin-edit me-2" size="sm" onClick={() => openEdit(r)}>✏️ Editar</Button>
                      <Button className="btn-admin-delete" size="sm" onClick={() => handleDelete(r)}>🗑️ Eliminar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
      <RoomFormModal show={showModal} handleClose={closeModal} handleSave={handleSave} selectedRoom={selectedRoom} />
    </main>
  )
}

export default RoomsPage
