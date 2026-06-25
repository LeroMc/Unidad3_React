import { Outlet, Link, useNavigate } from "react-router-dom"
import { Navbar, Nav, Container, Button } from "react-bootstrap"


const logoPlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%230d6efd'%3E%3Ccircle cx='50' cy='50' r='45' stroke='%23ffffff' stroke-width='5'/%3E%3Cpath d='M30 50 L45 35 L70 65' stroke='%23ffffff' stroke-width='8' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E";

function AdminLayout() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user")) || {}

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <div className="admin-theme min-vh-100 d-flex flex-column">
      
      <style>{`
        .admin-theme {
          background-color: #f8f9fa;
        }
        .nav-link-custom {
          color: rgba(255, 255, 255, 0.75) !important;
          text-decoration: none;
          display: inline-block;
          transition: color 0.2s ease-in-out;
        }
        .nav-link-custom:hover {
          color: #ffffff !important;
        }
        .tracking-wider {
          letter-spacing: 0.05em;
        }
      `}</style>

      
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm border-bottom border-secondary">
        <Container fluid>
          <Navbar.Brand as={Link} to="/admin/dashboard" className="d-flex align-items-center gap-2 fw-bold text-uppercase tracking-wider">
            <img
              src={logoPlaceholder}
              alt="SportClub Logo"
              width="40"
              height="40"
              className="d-inline-block align-top rounded-circle border border-light"
            />
            <span className="text-light">Sport</span>
            <span className="text-primary">Club</span>
            <span className="badge bg-danger ms-2 font-monospace fs-6">ADMIN</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="admin-navbar-nav" />
          <Navbar.Collapse id="admin-navbar-nav">
            <Nav className="me-auto ms-3 gap-1">
              <Nav.Link as={Link} to="/admin/dashboard" className="nav-link-custom px-3">
                📊 Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/users" className="nav-link-custom px-3">
                👥 Usuarios
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/sports" className="nav-link-custom px-3">
                🏆 Deportes
              </Nav.Link>
            </Nav>

            <Nav className="align-items-center gap-3">
              <span className="text-light small">
                Bienvenido, <strong className="text-primary">{user.full_name || "Administrador"}</strong>
              </span>
              <Button as={Link} to="/perfil" variant="outline-primary" size="sm" className="px-3">
                👤 Mi Perfil
              </Button>
              <Button variant="danger" size="sm" onClick={handleLogout} className="px-3">
                🚪 Salir
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      
      <div className="flex-grow-1 bg-light">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout