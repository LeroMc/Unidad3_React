/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react"
import { Card, Col, Row, Spinner } from "react-bootstrap"
import { Link } from "react-router-dom"
import { getUser } from "../../services/authService"
import { getCoachDashboard } from "../../services/coachService"

function CoachDashboard() {
  const user = getUser()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCoachDashboard()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <div className="caja-bienvenida">
        <h1>Panel de Entrenador</h1>
        <p className="mb-0">Bienvenido, <strong>{user?.full_name}</strong></p>
      </div>

      <main className="p-4">
        {loading ? (
          <div className="text-center py-4"><Spinner animation="border" /></div>
        ) : (
          <Row className="g-3 mb-4">
            <Col sm={4}>
              <Card className="shadow-sm border-0 bg-success text-white">
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div><div className="fs-2 fw-bold">{stats?.total_classes ?? "—"}</div><div className="small">Mis Clases</div></div>
                  <div className="fs-1 opacity-50">🎯</div>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={4}>
              <Card className="shadow-sm border-0 bg-teal text-white" style={{ backgroundColor: "#20c997" }}>
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div><div className="fs-2 fw-bold">{stats?.total_schedules ?? "—"}</div><div className="small">Horarios Activos</div></div>
                  <div className="fs-1 opacity-50">📅</div>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={4}>
              <Card className="shadow-sm border-0 bg-info text-white">
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div><div className="fs-2 fw-bold">{stats?.total_rooms ?? "—"}</div><div className="small">Salas Asignadas</div></div>
                  <div className="fs-1 opacity-50">🏟️</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        <Row className="g-3">
          <Col md={6}>
            <Card as={Link} to="/coach/my-classes" className="shadow-sm text-decoration-none h-100 border-0"
              style={{ transition: "transform .15s" }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
              <Card.Body>
                <div className="fs-2 mb-2">🎯</div>
                <h5 className="text-dark">Mis Clases</h5>
                <p className="text-muted small mb-0">Ver las disciplinas deportivas que tienes asignadas.</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card as={Link} to="/coach/my-schedule" className="shadow-sm text-decoration-none h-100 border-0"
              style={{ transition: "transform .15s" }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
              <Card.Body>
                <div className="fs-2 mb-2">📅</div>
                <h5 className="text-dark">Mi Horario</h5>
                <p className="text-muted small mb-0">Consultar tu horario semanal de clases.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </main>
    </>
  )
}

export default CoachDashboard
