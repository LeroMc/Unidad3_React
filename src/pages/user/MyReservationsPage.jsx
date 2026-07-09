import { useState, useEffect } from "react"
import { Badge, Button, Card, Spinner, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import { getMyReservations, cancelReservation } from "../../services/reservationService"

const DAYS = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

function MyReservationsPage() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)

  const loadReservations = async () => {
    setLoading(true)
    try {
      const data = await getMyReservations()
      setReservations(Array.isArray(data) ? data : [])
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadReservations() }, [])

  const handleCancel = async (reservation) => {
    const result = await Swal.fire({
      title: "¿Cancelar reserva?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "Volver",
    })

    if (result.isConfirmed) {
      try {
        await cancelReservation(reservation.id)
        Swal.fire({
          icon: "success",
          title: "Reserva cancelada",
          text: "Tu reserva fue cancelada correctamente.",
          timer: 1800,
          showConfirmButton: false,
        })
        loadReservations()
      } catch (err) {
        Swal.fire({ icon: "error", title: "Error", text: err.message })
      }
    }
  }

  const getScheduleInfo = (r) => {
    const s = r.classSchedule || r.class_schedule
    if (!s) return { day: "—", time: "—", sport: "—", room: "—" }
    const sr = s.sportRoom || s.sport_room
    return {
      day: DAYS[s.day_of_week] || s.day_of_week,
      time: `${s.start_time} – ${s.end_time}`,
      sport: sr?.sport?.name || "—",
      room: sr?.room?.name || "—",
    }
  }

  const active = reservations.filter((r) => r.status === "active")
  const cancelled = reservations.filter((r) => r.status === "cancelled")

  return (
    <main className="container-fluid py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3">
          <h4 className="mb-0">📌 Mis Reservas</h4>
          <Button variant="light" size="sm" onClick={loadReservations} disabled={loading}>
            {loading ? <Spinner size="sm" animation="border" /> : "🔄 Refrescar"}
          </Button>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Cargando tus reservas...</p>
            </div>
          ) : reservations.length === 0 ? (
            <div className="alert alert-info text-center">
              No tienes reservas aún. Ve a <strong>Clases Disponibles</strong> para reservar.
            </div>
          ) : (
            <>
              <h5 className="mb-3">Reservas Activas ({active.length})</h5>
              {active.length === 0 ? (
                <p className="text-muted mb-4">No tienes reservas activas.</p>
              ) : (
                <Table striped hover responsive className="mb-4">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Deporte</th>
                      <th>Sala</th>
                      <th>Día</th>
                      <th>Horario</th>
                      <th>Estado</th>
                      <th className="text-end">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {active.map((r) => {
                      const info = getScheduleInfo(r)
                      return (
                        <tr key={r.id}>
                          <td><strong>{r.id}</strong></td>
                          <td>{info.sport}</td>
                          <td>{info.room}</td>
                          <td>{info.day}</td>
                          <td>{info.time}</td>
                          <td><Badge bg="success">Activa</Badge></td>
                          <td className="text-end">
                            <Button variant="outline-danger" size="sm" onClick={() => handleCancel(r)}>
                              ❌ Cancelar
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              )}

              {cancelled.length > 0 && (
                <>
                  <h5 className="mb-3 text-muted">Reservas Canceladas ({cancelled.length})</h5>
                  <Table hover responsive className="mb-0 opacity-75">
                    <thead className="table-secondary">
                      <tr>
                        <th>ID</th>
                        <th>Deporte</th>
                        <th>Sala</th>
                        <th>Día</th>
                        <th>Horario</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cancelled.map((r) => {
                        const info = getScheduleInfo(r)
                        return (
                          <tr key={r.id}>
                            <td><strong>{r.id}</strong></td>
                            <td>{info.sport}</td>
                            <td>{info.room}</td>
                            <td>{info.day}</td>
                            <td>{info.time}</td>
                            <td><Badge bg="secondary">Cancelada</Badge></td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </Table>
                </>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </main>
  )
}

export default MyReservationsPage
