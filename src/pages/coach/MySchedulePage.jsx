import { useState, useEffect } from "react"
import { Badge, Button, Card, Spinner, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import { getMySchedules } from "../../services/coachService"

const DAYS = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

function MySchedulePage() {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)

  const loadSchedules = async () => {
    setLoading(true)
    try {
      const data = await getMySchedules()
      setSchedules(Array.isArray(data) ? data : [])
    } catch (err) { Swal.fire({ icon: "error", title: "Error", text: err.message }) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadSchedules() }, [])

  return (
    <main className="container-fluid py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center py-3">
          <h4 className="mb-0">Mi Horario Semanal</h4>
          <Button variant="light" size="sm" onClick={loadSchedules} disabled={loading}>
            {loading ? <Spinner size="sm" animation="border" /> : "🔄 Refrescar"}
          </Button>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5"><Spinner animation="border" variant="success" /><p className="mt-2 text-muted">Cargando tu horario...</p></div>
          ) : schedules.length === 0 ? (
            <div className="alert alert-info text-center">No tienes horarios asignados actualmente.</div>
          ) : (
            <Table striped hover responsive>
              <thead className="table-dark">
                <tr><th>Día</th><th>Hora Inicio</th><th>Hora Término</th><th>Deporte</th><th>Sala</th><th>Estado</th></tr>
              </thead>
              <tbody>
                {schedules.map((s) => (
                  <tr key={s.id}>
                    <td><strong>{DAYS[s.day_of_week] || s.day_of_week}</strong></td>
                    <td>{s.start_time}</td>
                    <td>{s.end_time}</td>
                    <td>{s.sportRoom?.sport?.name || "—"}</td>
                    <td>{s.sportRoom?.room?.name || "—"}</td>
                    <td><Badge bg={s.status ? "success" : "secondary"}>{s.status ? "Activo" : "Inactivo"}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </main>
  )
}

export default MySchedulePage
