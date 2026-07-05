/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react"
import { Badge, Button, Card, Col, Row, Spinner } from "react-bootstrap"
import Swal from "sweetalert2"
import { getMyClasses } from "../../services/coachService"

const DAYS = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

function MyClassesPage() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  const loadClasses = async () => {
    setLoading(true)
    try {
      const data = await getMyClasses()
      setClasses(Array.isArray(data) ? data : [])
    } catch (err) { Swal.fire({ icon: "error", title: "Error", text: err.message }) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadClasses() }, [])

  return (
    <main className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">🎯 Mis Clases</h3>
        <Button variant="outline-secondary" size="sm" onClick={loadClasses} disabled={loading}>
          {loading ? <Spinner size="sm" animation="border" /> : "🔄 Refrescar"}
        </Button>
      </div>
      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /><p className="mt-2 text-muted">Cargando tus clases...</p></div>
      ) : classes.length === 0 ? (
        <div className="alert alert-info text-center">No tienes clases asignadas actualmente.</div>
      ) : (
        <Row className="g-4">
          {classes.map((c) => (
            <Col md={6} lg={4} key={c.id}>
              <Card className="shadow-sm h-100">
                <Card.Header className="bg-success text-white">
                  <h5 className="mb-0">🏅 {c.sport?.name || "Deporte"}</h5>
                </Card.Header>
                <Card.Body>
                  <p className="mb-1"><strong>Sala:</strong> {c.room?.name || "—"}</p>
                  <p className="mb-1"><strong>Capacidad:</strong> {c.room?.capacity || "—"} personas</p>
                  <p className="mb-2"><strong>Objetivo:</strong> <span className="text-muted small">{c.sport?.objective || "—"}</span></p>
                  <p className="mb-2"><strong>Duración:</strong> {c.sport?.duration || "—"} min</p>
                  <Badge bg={c.status ? "success" : "secondary"}>{c.status ? "Activa" : "Inactiva"}</Badge>
                  {c.schedules && c.schedules.length > 0 && (
                    <div className="mt-3">
                      <strong className="small">Horarios:</strong>
                      {c.schedules.map((s) => (
                        <div key={s.id} className="small text-muted border-start border-success ps-2 mt-1">
                          {DAYS[s.day_of_week]}: {s.start_time} – {s.end_time}
                        </div>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </main>
  )
}

export default MyClassesPage
