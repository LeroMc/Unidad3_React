import { Link, Outlet, useNavigate } from "react-router-dom"
import { Button, Container, Nav, Navbar } from "react-bootstrap"
import { logout, getUser } from "../services/authService"
import logo from "../assets/images/logo1.png"
import "../styles/admin.css"

function AdminLayout() {
  const navigate = useNavigate()
  const user = getUser()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="admin-theme">
      <Navbar expand="lg" className="navbar-role" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/admin/dashboard">
            <img src={logo} alt="Logo SportClub" />
            SportClub Admin
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="admin-navbar" />
          <Navbar.Collapse id="admin-navbar">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/admin/dashboard">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/admin/users">Gestión Usuarios</Nav.Link>
            </Nav>
            <Nav className="d-flex align-items-center gap-2">
              <span className="text-white me-2">{user?.full_name}</span>
              <Nav.Link as={Link} to="/perfil">
                <Button className="btn-role" size="sm">Mi Perfil</Button>
              </Nav.Link>
              <Button variant="outline-light" size="sm" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Outlet />
    </div>
  )
}

export default AdminLayout
