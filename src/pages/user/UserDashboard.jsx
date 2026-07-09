import { useState, useEffect } from "react"
import { Card, Col, Row, Spinner } from "react-bootstrap"
import { Link } from "react-router-dom"
import { getUser } from "../../services/authService"
import { getMemberDashboard } from "../../services/memberService"

const BLUE = "rgb(131, 155, 232)"
const BLUE_DARK = "rgb(6, 2, 145)"

function UserDashboard() {
  const user = getUser()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMemberDashboard()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <div className="caja-bienvenida">
        <h1>Bienvenido a SportClub</h1>
        <p className="mb-0">Hola, <strong>{user?.full_name}</strong> 👋</p>
      </div>

      <main className="p-4">
        {loading ? (
          <div className="text-center py-4"><Spinner animation="border" /></div>
        ) : (
          <Row className="g-3 mb-4">
            <Col sm={4}>
              <Card className="shadow-sm border-0 bg-primary text-white">
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div><div className="fs-2 fw-bold">{stats?.available_classes ?? "—"}</div><div className="small">Clases Disponibles</div></div>
                  <div className="fs-1 opacity 0">📋</div>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={4}>
              <Card className="shadow-sm border-0 bg-info text-white">
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div><div className="fs-2 fw-bold">{stats?.available_sports ?? "—"}</div><div className="small">Deportes Activos</div></div>
                  <div className="fs-1 opacity 0">🏅</div>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={4}>
              <Card className="shadow-sm border-0 bg-success text-white">
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div><div className="fs-2 fw-bold">{stats?.available_schedules ?? "—"}</div><div className="small">Horarios Activos</div></div>
                  <div className="fs-1 opacity 0">🕐</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        <Row className="g-3">
          <Col md={6}>
            <Card as={Link} to="/user/classes" className="shadow-sm text-decoration-none h-100 border-2"
              style={{ transition: "transform .15s", border: `2px solid ${BLUE}` }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
              <Card.Body>
                <div className="fs-2 mb-2">📋</div>
                <h5 className="text-dark">Clases Disponibles</h5>
                <p className="text-muted small mb-0">Explora las clases disponibles y realiza una reserva.</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card as={Link} to="/user/reservations" className="shadow-sm text-decoration-none h-100 border-2"
              style={{ transition: "transform .15s", border: `2px solid ${BLUE}` }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
              <Card.Body>
                <div className="fs-2 mb-2">📌</div>
                <h5 className="text-dark">Mis Reservas</h5>
                <p className="text-muted small mb-0">Ver y cancelar tus reservas activas.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </main>
    </>
  )
}

export default UserDashboard
