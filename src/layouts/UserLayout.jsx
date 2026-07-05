import { Link, Outlet, useNavigate } from "react-router-dom"
import { Button, Container, Nav, Navbar } from "react-bootstrap"
import { logout, getUser } from "../services/authService"
import logo from "../assets/images/logo1.png"
import "../styles/user.css"

function UserLayout() {
  const navigate = useNavigate()
  const user = getUser()

  const handleLogout = () => { logout(); navigate("/Login") }

  return (
    <div className="user-theme">
      <style>{`
        .caja-bienvenida { border-left: 8px solid rgb(33,110,214); border-radius: 8px; margin: 20px 24px 0; background: white; padding: 14px 22px; }
        .caja-bienvenida h1 { color: rgb(20,70,150); font-size: 1.6rem; margin: 0; }
      `}</style>
      <Navbar expand="lg" className="navbar-role" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/user/dashboard">
            <img src={logo} alt="Logo SportClub" />
            SportClub
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="user-nav" />
          <Navbar.Collapse id="user-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/user/dashboard">Inicio</Nav.Link>
              <Nav.Link as={Link} to="/user/classes">Clases Disponibles</Nav.Link>
              <Nav.Link as={Link} to="/user/reservations">Mis Reservas</Nav.Link>
            </Nav>
            <Nav className="d-flex align-items-center gap-2">
              <span className="text-white me-2">{user?.full_name}</span>
              <Button as={Link} to="/profile" className="btn-role" size="sm">Mi Perfil</Button>
              <Button variant="outline-light" size="sm" onClick={handleLogout}>Cerrar Sesión</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  )
}

export default UserLayout
