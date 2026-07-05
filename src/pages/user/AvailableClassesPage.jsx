/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react"
import { Badge, Button, Card, Col, Modal, Form, Row, Spinner } from "react-bootstrap"
import Swal from "sweetalert2"
import { getAvailableClasses } from "../../services/memberService"
import { createReservation } from "../../services/reservationService"

const DAYS = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

function AvailableClassesPage() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const [selectedClassName, setSelectedClassName] = useState("")
  const [observation, setObservation] = useState("")
  const [saving, setSaving] = useState(false)

  const loadClasses = async () => {
    setLoading(true)
    try {
      const data = await getAvailableClasses()
      setClasses(Array.isArray(data) ? data : [])
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadClasses() }, [])

  const openReservationModal = (schedule, className) => {
    setSelectedSchedule(schedule)
    setSelectedClassName(className)
    setObservation("")
    setShowModal(true)
  }

  const handleReserve = async () => {
    setSaving(true)
    try {
      await createReservation(selectedSchedule.id, observation)
      setShowModal(false)
      await Swal.fire({
        icon: "success",
        title: "¡Reserva creada!",
        text: "Tu reserva fue registrada correctamente.",
        timer: 2000,
        showConfirmButton: false,
      })
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error al reservar", text: err.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">📋 Clases Disponibles</h3>
        <Button variant="outline-secondary" size="sm" onClick={loadClasses} disabled={loading}>
          {loading ? <Spinner size="sm" animation="border" /> : "🔄 Refrescar"}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Cargando clases disponibles...</p>
        </div>
      ) : classes.length === 0 ? (
        <div className="alert alert-info text-center">No hay clases disponibles en este momento.</div>
      ) : (
        <Row className="g-4">
          {classes.map((c) => (
            <Col md={6} lg={4} key={c.id}>
              <Card className="shadow-sm h-100">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">🏅 {c.sport?.name || "Deporte"}</h5>
                  <small>{c.room?.name || "Sala"} · Cap. {c.room?.capacity || "—"}</small>
                </Card.Header>
                <Card.Body>
                  <p className="text-muted small mb-2">{c.sport?.objective || ""}</p>
                  <p className="mb-1"><strong>Duración:</strong> {c.sport?.duration || "—"} min</p>
                  <p className="mb-1"><strong>Ubicación:</strong> {c.room?.location || "—"}</p>
                  <p className="mb-3"><strong>Coach:</strong> {c.coach?.email || "—"}</p>

                  {c.schedules && c.schedules.length > 0 ? (
                    <>
                      <strong className="small d-block mb-2">Horarios disponibles:</strong>
                      {c.schedules.map((s) => (
                        <div key={s.id} className="d-flex justify-content-between align-items-center border rounded p-2 mb-2">
                          <div className="small">
                            <strong>{DAYS[s.day_of_week]}</strong>
                            <div className="text-muted">{s.start_time} – {s.end_time}</div>
                          </div>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => openReservationModal(s, c.sport?.name)}
                          >
                            Reservar
                          </Button>
                        </div>
                      ))}
                    </>
                  ) : (
                    <Badge bg="secondary">Sin horarios activos</Badge>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal de confirmación de reserva */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>📌 Confirmar Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSchedule && (
            <>
              <p><strong>Clase:</strong> {selectedClassName}</p>
              <p><strong>Día:</strong> {DAYS[selectedSchedule.day_of_week]}</p>
              <p><strong>Horario:</strong> {selectedSchedule.start_time} – {selectedSchedule.end_time}</p>
              <Form.Group className="mt-3">
                <Form.Label>Observación (opcional)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: Tengo una lesión en el hombro..."
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleReserve} disabled={saving}>
            {saving ? <><Spinner size="sm" animation="border" /> Reservando...</> : "Confirmar Reserva"}
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  )
}

export default AvailableClassesPage
