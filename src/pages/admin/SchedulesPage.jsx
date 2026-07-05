/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react"
import { Badge, Button, Card, Spinner, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import { getSchedules, createSchedule, updateSchedule, deleteSchedule } from "../../services/scheduleService"
import { getSportRooms } from "../../services/sportRoomService"
import ScheduleFormModal from "../../components/schedules/ScheduleFormModal"

const DAYS = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

function SchedulesPage() {
  const [schedules, setSchedules]   = useState([])
  const [sportRooms, setSportRooms] = useState([])
  const [loading, setLoading]       = useState(true)
  const [showModal, setShowModal]   = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState(null)

  const loadAll = async () => {
    setLoading(true)
    try {
      const [schData, srData] = await Promise.all([getSchedules(), getSportRooms()])
      setSchedules(Array.isArray(schData) ? schData : [])
      setSportRooms(Array.isArray(srData) ? srData : [])
    } catch (err) { Swal.fire({ icon: "error", title: "Error", text: err.message }) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadAll() }, [])

  const openCreate = () => { setSelectedSchedule(null); setShowModal(true) }
  const openEdit   = (s) => { setSelectedSchedule(s);   setShowModal(true) }
  const closeModal = ()  => { setShowModal(false);       setSelectedSchedule(null) }

  const handleSave = async (payload) => {
    try {
      if (selectedSchedule) {
        await updateSchedule(selectedSchedule.id, payload)
        Swal.fire({ icon: "success", title: "Actualizado", text: "Horario actualizado.", timer: 1800, showConfirmButton: false })
      } else {
        await createSchedule(payload)
        Swal.fire({ icon: "success", title: "Creado", text: "Horario creado correctamente.", timer: 1800, showConfirmButton: false })
      }
      closeModal(); loadAll()
    } catch (err) { Swal.fire({ icon: "error", title: "Error", text: err.message }) }
  }

  const handleDelete = async (s) => {
    const res = await Swal.fire({
      title: "¿Eliminar horario?",
      text: `${DAYS[s.day_of_week] || s.day_of_week}: ${s.start_time} – ${s.end_time}`,
      icon: "warning", showCancelButton: true,
      confirmButtonColor: "#d33", confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar",
    })
    if (res.isConfirmed) {
      try {
        await deleteSchedule(s.id)
        Swal.fire({ icon: "success", title: "Eliminado", timer: 1500, showConfirmButton: false })
        loadAll()
      } catch (err) { Swal.fire({ icon: "error", title: "Error", text: err.message }) }
    }
  }

  const getAssignmentLabel = (s) => {
    const sr = s.sportRoom || sportRooms.find(r => r.id === s.sport_room_id)
    if (!sr) return `Asignación #${s.sport_room_id}`
    return `${sr.sport?.name || "?"} / ${sr.room?.name || "?"}`
  }

  return (
    <main className="container-fluid py-4">
      <Card className="shadow-sm">
        <Card.Header className="admin-card-header d-flex justify-content-between align-items-center py-3">
          <h4 className="mb-0">🕐 Gestión de Horarios</h4>
          <div className="d-flex gap-2">
            <Button variant="light" onClick={loadAll} disabled={loading}>
              {loading ? <Spinner size="sm" animation="border" /> : "🔄 Refrescar"}
            </Button>
            <Button variant="warning" className="text-dark fw-semibold" onClick={openCreate}>
              ➕ Nuevo Horario
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" style={{ color: "rgb(191,44,44)" }} />
              <p className="mt-2 text-muted">Cargando horarios...</p>
            </div>
          ) : schedules.length === 0 ? (
            <div className="alert alert-info text-center">No hay horarios registrados.</div>
          ) : (
            <Table striped hover responsive className="mb-0">
              <thead className="table-dark">
                <tr><th>ID</th><th>Asignación</th><th>Día</th><th>Inicio</th><th>Término</th><th>Estado</th><th className="text-end">Acciones</th></tr>
              </thead>
              <tbody>
                {schedules.map((s) => (
                  <tr key={s.id}>
                    <td><strong>#{s.id}</strong></td>
                    <td>{getAssignmentLabel(s)}</td>
                    <td>{DAYS[s.day_of_week] || s.day_of_week}</td>
                    <td>{s.start_time}</td>
                    <td>{s.end_time}</td>
                    <td><Badge bg={s.status ? "success" : "danger"}>{s.status ? "Activo" : "Inactivo"}</Badge></td>
                    <td className="text-end">
                      <Button className="btn-admin-edit me-2" size="sm" onClick={() => openEdit(s)}>✏️ Editar</Button>
                      <Button className="btn-admin-delete" size="sm" onClick={() => handleDelete(s)}>🗑️ Eliminar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
      <ScheduleFormModal show={showModal} handleClose={closeModal} handleSave={handleSave}
        selectedSchedule={selectedSchedule} sportRooms={sportRooms} />
    </main>
  )
}

export default SchedulesPage
