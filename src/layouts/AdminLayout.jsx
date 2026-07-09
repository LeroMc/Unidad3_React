import { Outlet, Link, useNavigate } from "react-router-dom"
import { Navbar, Nav, Container, Button } from "react-bootstrap"
import logo from "../assets/images/logo1.png"
import "../styles/admin.css"

const RED = "rgb(191, 44, 44)"
const RED_DARK = "rgb(150, 28, 28)"

function AdminLayout() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user")) || {}

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/Login")
  }

  return (
    <div className="admin-theme min-vh-100 d-flex flex-column">
      <Navbar
        expand="lg"
        className="shadow"
        style={{ backgroundColor: RED, borderBottom: `3px solid ${RED_DARK}` }}
        variant="dark"
      >
        <Container fluid>
          <Navbar.Brand as={Link} to="/admin/dashboard" className="d-flex align-items-center gap-2 p-0">
            <img
              src={logo}
              alt="SportClub"
              style={{ height: "54px", width: "auto", objectFit: "contain" }}
            />
            <span className="fw-bold fs-5 text-white">
              Sport<span style={{ color: "#ffc107" }}>Club</span>
            </span>
            <span className="badge ms-1 fs-6" style={{ backgroundColor: RED_DARK, border: "1px solid #fff8" }}>
              ADMIN
            </span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="admin-nav" />
          <Navbar.Collapse id="admin-nav">
            <Nav className="me-auto ms-3 gap-1">
              {[
                ["/admin/dashboard",  "Dashboard"],
                ["/admin/users",      "Usuarios"],
                ["/admin/sports",     "Deportes"],
                ["/admin/rooms",      "Salas"],
                ["/admin/assignments","Asignaciones"],
                ["/admin/schedules",  "Horarios"],
              ].map(([to, label]) => (
                <Nav.Link
                  key={to}
                  as={Link}
                  to={to}
                  className="px-3 py-1 rounded"
                  style={{ color: "rgba(255,255,255,.85)", fontWeight: 500 }}
                  onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.85)"}
                >
                  {label}
                </Nav.Link>
              ))}
            </Nav>
            <Nav className="align-items-center gap-2">
              <span className="text-white small">
                Hola, <strong className="text-warning">{user.full_name || "Admin"}</strong>
              </span>
              <Button as={Link} to="/profile" variant="outline-light" size="sm">
                Mi Perfil
              </Button>
              <Button
                size="sm"
                style={{ backgroundColor: RED_DARK, border: "none" }}
                onClick={handleLogout}
              >
                🚪 Salir
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="flex-grow-1">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout
