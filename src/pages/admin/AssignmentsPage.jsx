import { useState, useEffect } from "react"
import { Badge, Button, Card, Spinner, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import { getSportRooms, createSportRoom, updateSportRoom, deleteSportRoom } from "../../services/sportRoomService"
import { getSports } from "../../services/sportService"
import { getRooms } from "../../services/roomService"
import { getUsers } from "../../services/userService"
import AssignmentFormModal from "../../components/assignments/AssignmentFormModal"

function AssignmentsPage() {
  const [assignments, setAssignments] = useState([])
  const [sports, setSports]           = useState([])
  const [rooms, setRooms]             = useState([])
  const [coaches, setCoaches]         = useState([])
  const [loading, setLoading]         = useState(true)
  const [showModal, setShowModal]     = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)

  const loadAll = async () => {
    setLoading(true)
    try {
      const [assignData, sportData, roomData, userData] = await Promise.all([
        getSportRooms(), getSports(), getRooms(), getUsers()
      ])
      setAssignments(Array.isArray(assignData) ? assignData : [])
      setSports(Array.isArray(sportData) ? sportData : [])
      setRooms(Array.isArray(roomData) ? roomData : [])
      const usersArr = userData.data || userData
      setCoaches(Array.isArray(usersArr) ? usersArr.filter(u => u.role === "coach") : [])
    } catch (err) { Swal.fire({ icon: "error", title: "Error", text: err.message }) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadAll() }, [])

  const openCreate = () => { setSelectedAssignment(null); setShowModal(true) }
  const openEdit   = (a) => { setSelectedAssignment(a);   setShowModal(true) }
  const closeModal = ()  => { setShowModal(false);         setSelectedAssignment(null) }

  const handleSave = async (payload) => {
    try {
      if (selectedAssignment) {
        await updateSportRoom(selectedAssignment.id, payload)
        Swal.fire({ icon: "success", title: "Actualizado", text: "Asignación actualizada.", timer: 1800, showConfirmButton: false })
      } else {
        await createSportRoom(payload)
        Swal.fire({ icon: "success", title: "Creado", text: "Asignación creada correctamente.", timer: 1800, showConfirmButton: false })
      }
      closeModal(); loadAll()
    } catch (err) { Swal.fire({ icon: "error", title: "Error", text: err.message }) }
  }

  const handleDelete = async (a) => {
    const res = await Swal.fire({
      title: "¿Eliminar asignación?", text: `Se eliminará la asignación #${a.id}.`,
      icon: "warning", showCancelButton: true,
      confirmButtonColor: "#d33", confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar",
    })
    if (res.isConfirmed) {
      try {
        await deleteSportRoom(a.id)
        Swal.fire({ icon: "success", title: "Eliminado", timer: 1500, showConfirmButton: false })
        loadAll()
      } catch (err) { Swal.fire({ icon: "error", title: "Error", text: err.message }) }
    }
  }

  const label = (a) => {
    const sport = a.sport?.name || sports.find(s => s.id === a.sport_id)?.name || a.sport_id
    const room  = a.room?.name  || rooms.find(r => r.id === a.room_id)?.name   || a.room_id
    const coach = a.coach?.email || coaches.find(c => c.id === a.coach_id)?.full_name || a.coach_id
    return { sport, room, coach }
  }

  return (
    <main className="container-fluid py-4">
      <Card className="shadow-sm">
        <Card.Header className="admin-card-header d-flex justify-content-between align-items-center py-3">
          <h4 className="mb-0">🔗 Gestión de Asignaciones</h4>
          <div className="d-flex gap-2">
            <Button variant="light" onClick={loadAll} disabled={loading}>
              {loading ? <Spinner size="sm" animation="border" /> : "🔄 Refrescar"}
            </Button>
            <Button variant="warning" className="text-dark fw-semibold" onClick={openCreate}>
              ➕ Nueva Asignación
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <p className="text-muted mb-3 small">Cada asignación vincula un Deporte, una Sala y un Coach. Sobre estas se crean los Horarios.</p>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" style={{ color: "rgb(191,44,44)" }} />
              <p className="mt-2 text-muted">Cargando asignaciones...</p>
            </div>
          ) : assignments.length === 0 ? (
            <div className="alert alert-info text-center">No hay asignaciones registradas.</div>
          ) : (
            <Table striped hover responsive className="mb-0">
              <thead className="table-dark">
                <tr><th>ID</th><th>Deporte</th><th>Sala</th><th>Coach</th><th>Estado</th><th className="text-end">Acciones</th></tr>
              </thead>
              <tbody>
                {assignments.map((a) => {
                  const info = label(a)
                  return (
                    <tr key={a.id}>
                      <td><strong>{a.id}</strong></td>
                      <td>{info.sport}</td>
                      <td>{info.room}</td>
                      <td>{info.coach}</td>
                      <td><Badge bg={a.status ? "success" : "danger"}>{a.status ? "Activa" : "Inactiva"}</Badge></td>
                      <td className="text-end">
                        <Button className="btn-admin-edit me-2" size="sm" onClick={() => openEdit(a)}>✏️ Editar</Button>
                        <Button className="btn-admin-delete" size="sm" onClick={() => handleDelete(a)}>🗑️ Eliminar</Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
      <AssignmentFormModal show={showModal} handleClose={closeModal} handleSave={handleSave}
        selectedAssignment={selectedAssignment} sports={sports} rooms={rooms} coaches={coaches} />
    </main>
  )
}

export default AssignmentsPage
