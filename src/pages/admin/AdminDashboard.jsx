/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react"
import { Card, Col, Row, Spinner } from "react-bootstrap"
import { Link } from "react-router-dom"
import { getUser } from "../../services/authService"
import { getUsers } from "../../services/userService"
import { getSports } from "../../services/sportService"
import { getRooms } from "../../services/roomService"
import { getSportRooms } from "../../services/sportRoomService"

const RED = "rgb(191, 44, 44)"
const RED_DARK = "rgb(150, 28, 28)"

const MODULES = [
  { to: "/admin/users",       icon: "👥", title: "Gestión de Usuarios",    desc: "Crear, editar y eliminar cuentas del sistema." },
  { to: "/admin/sports",      icon: "🏆", title: "Gestión de Deportes",    desc: "Administrar las disciplinas deportivas del club." },
  { to: "/admin/rooms",       icon: "🏟️", title: "Gestión de Salas",       desc: "Administrar instalaciones y salas disponibles." },
  { to: "/admin/assignments", icon: "🔗", title: "Asignaciones",           desc: "Vincular deportes, salas y coaches." },
  { to: "/admin/schedules",   icon: "🕐", title: "Horarios",               desc: "Definir días y horarios de clases." },
]

function StatCard({ title, value, icon, to }) {
  return (
    <Col sm={6} xl={3}>
      <Card
        className="shadow-sm h-100 text-white"
        style={{ backgroundColor: RED, border: `2px solid ${RED_DARK}` }}
      >
        <Card.Body className="d-flex justify-content-between align-items-center">
          <div>
            <div className="fs-2 fw-bold">{value}</div>
            <div className="small opacity-90">{title}</div>
          </div>
          <div className="fs-1 opacity-40">{icon}</div>
        </Card.Body>
        {to && (
          <Card.Footer style={{ backgroundColor: RED_DARK, border: "none" }}>
            <Link to={to} className="text-white text-decoration-none small fw-semibold">
              Ver más →
            </Link>
          </Card.Footer>
        )}
      </Card>
    </Col>
  )
}

function AdminDashboard() {
  const user = getUser()
  const [stats, setStats] = useState({ users: "—", sports: "—", rooms: "—", assignments: "—" })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [usersData, sportsData, roomsData, assignData] = await Promise.all([
          getUsers().catch(() => ({ data: [] })),
          getSports().catch(() => []),
          getRooms().catch(() => []),
          getSportRooms().catch(() => []),
        ])
        const usersArr = usersData.data || usersData
        setStats({
          users:       Array.isArray(usersArr)    ? usersArr.length    : "—",
          sports:      Array.isArray(sportsData)  ? sportsData.length  : "—",
          rooms:       Array.isArray(roomsData)   ? roomsData.length   : "—",
          assignments: Array.isArray(assignData)  ? assignData.length  : "—",
        })
      } catch { /* stats keep dashes */ }
      finally { setLoading(false) }
    }
    loadStats()
  }, [])

  return (
    <>
      <div className="caja-bienvenida">
        <h1>Panel de Administración</h1>
        <p className="mb-0 text-muted">
          Bienvenido, <strong style={{ color: RED }}>{user?.full_name}</strong>
        </p>
      </div>

      <main className="p-4">
        {/* Tarjetas de estadísticas */}
        {loading ? (
          <div className="text-center py-4"><Spinner animation="border" style={{ color: RED }} /></div>
        ) : (
          <Row className="g-3 mb-4">
            <StatCard title="Usuarios registrados" value={stats.users}       icon="👥" to="/admin/users" />
            <StatCard title="Deportes registrados" value={stats.sports}      icon="🏆" to="/admin/sports" />
            <StatCard title="Salas disponibles"    value={stats.rooms}       icon="🏟️" to="/admin/rooms" />
            <StatCard title="Asignaciones"         value={stats.assignments} icon="🔗" to="/admin/assignments" />
          </Row>
        )}

        {/* Accesos rápidos a módulos */}
        <Row className="g-3">
          {MODULES.map((item) => (
            <Col md={4} key={item.to}>
              <Card
                as={Link}
                to={item.to}
                className="shadow-sm text-decoration-none h-100"
                style={{
                  border: `2px solid ${RED}`,
                  transition: "transform .15s, box-shadow .15s",
                  backgroundColor: "white",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)"
                  e.currentTarget.style.boxShadow = `0 6px 20px rgba(191,44,44,.2)`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = ""
                }}
              >
                <Card.Body>
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{
                      width: 52, height: 52,
                      backgroundColor: "#fdf0f0",
                      fontSize: 26,
                      border: `2px solid ${RED}`,
                    }}
                  >
                    {item.icon}
                  </div>
                  <h5 style={{ color: RED_DARK }}>{item.title}</h5>
                  <p className="text-muted small mb-0">{item.desc}</p>
                </Card.Body>
                <Card.Footer style={{ backgroundColor: "#fdf0f0", border: "none" }}>
                  <small style={{ color: RED, fontWeight: 600 }}>Ir al módulo →</small>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </main>
    </>
  )
}

export default AdminDashboard
