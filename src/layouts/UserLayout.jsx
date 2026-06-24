import { Link, Outlet, useNavigate } from "react-router-dom"
import { Button, Container, Nav, Navbar } from "react-bootstrap"
import { logout, getUser } from "../services/authService"
import logo from "../assets/images/logo1.png"
import "../styles/user.css"

function UserLayout() {
  const navigate = useNavigate()
  const user = getUser()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="user-theme">
      <Navbar expand="lg" className="navbar-role" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/user/dashboard">
            <img src={logo} alt="Logo SportClub" />
            SportClub
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="user-navbar" />
          <Navbar.Collapse id="user-navbar">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/user/dashboard">Inicio</Nav.Link>
              <Nav.Link as={Link} to="/user/dashboard">Reservas</Nav.Link>
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

export default UserLayout
