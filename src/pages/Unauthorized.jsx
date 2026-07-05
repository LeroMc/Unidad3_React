import { Link } from "react-router-dom"
import { Alert, Button, Container } from "react-bootstrap"

function Unauthorized() {
  return (
    <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
      <Alert variant="danger" className="text-center shadow" style={{ maxWidth: "480px" }}>
        <Alert.Heading>Acceso no autorizado</Alert.Heading>
        <p>No tienes permisos para acceder a esta sección del sistema.</p>
        <Link to="/login">
          <Button variant="danger">Volver al login</Button>
        </Link>
      </Alert>
    </Container>
  )
}

export default Unauthorized
