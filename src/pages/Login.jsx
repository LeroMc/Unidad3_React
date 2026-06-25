import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Alert, Button, Form, Spinner } from "react-bootstrap"
import Swal from "sweetalert2"
import { loginUser, saveSession } from "../services/authService"
import logo from "../assets/images/logo1.png"
import "../styles/Login.css"

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    setLoading(true)

    try {
      const data = await loginUser({ email, password })
      saveSession(data.data.token, data.data.user)

      const role = data.data.user.role

      if (data.data.user.must_change_password) {
        await Swal.fire({
          icon: "info",
          title: "Debes actualizar tu contraseña",
          text: "Por seguridad, actualiza tu contraseña desde Mi Perfil.",
        })
      } else {
        await Swal.fire({
          icon: "success",
          title: "¡Bienvenido!",
          text: "Inicio de sesión exitoso",
          timer: 1200,
          showConfirmButton: false,
        })
      }

      if (role === "admin") {
        navigate("/admin/dashboard")
      } else if (role === "coach") {
        navigate("/coach/dashboard")
      } else {
        navigate("/user/dashboard")
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-theme">
      <div className="login-card">
        <img src={logo} alt="Logo SportClub" className="login-logo" />
        <h1>Login</h1>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña:</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" className="btn-ingresar" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" animation="border" /> Ingresando...
              </>
            ) : (
              "Ingresar"
            )}
          </Button>
        </Form>

        <hr />

        <nav className="login-links">
          <Link to="/Register">Registrarse</Link>
          <span> | </span>
          <Link to="/">Volver al inicio</Link>
        </nav>

        <footer>© 2026 Club Deportivo SportClub</footer>
      </div>
    </div>
  )
}

export default Login
