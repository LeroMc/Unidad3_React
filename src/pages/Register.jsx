import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Form } from "react-bootstrap"
import Swal from "sweetalert2"
import { registerUser } from "../services/authService"
import logo from "../assets/images/logo1.png"
import "../styles/register.css"

const initialForm = {
  full_name: "",
  email: "",
  birth_date: "",
  deporte_favorito: "",
  frecuencia_semanal: "",
  password: "",
  confirm_password: "",
}

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialForm)
  const [error, setError] = useState("")

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const validate = () => {
    const { full_name, email, password, confirm_password } = formData

    if (!full_name.trim() || !email.trim() || !password || !confirm_password) {
      return "Todos los campos marcados son obligatorios."
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return "Por favor, ingresa un correo electrónico válido."
    }

    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres."
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])/
    if (!passwordRegex.test(password)) {
      return "La contraseña debe contener letras y números."
    }

    if (password !== confirm_password) {
      return "Las contraseñas no coinciden."
    }

    return ""
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    const userData = {
      full_name: formData.full_name,
      email: formData.email,
      password: formData.password,
      birth_date: formData.birth_date || null,
      metadata: {
        sports: formData.deporte_favorito
          ? [
              {
                name: formData.deporte_favorito.trim(),
                frequency_per_week: Number(formData.frecuencia_semanal) || 0,
              },
            ]
          : [],
      },
    }

    try {
      await registerUser(userData)
      await Swal.fire({
        icon: "success",
        title: "Registro completado",
        text: "Tu cuenta fue creada con éxito. Ahora puedes iniciar sesión.",
      })
      navigate("/login")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="registro-theme">
      <header>
        <img src={logo} alt="Logo SportClub" className="registro-logo" />
        <h1>REGISTRO DE USUARIO</h1>
      </header>

      <main className="contenedor-centrado">
        <div className="seccion-formulario">
          <Form onSubmit={handleSubmit}>
            <h2>Crea tu cuenta</h2>

            <Form.Group className="mb-3">
              <Form.Label>Nombre Completo</Form.Label>
              <Form.Control
                type="text"
                name="full_name"
                placeholder="Tu nombre y apellido"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="ejemplo@correo.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="d-flex gap-3">
              <Form.Group className="mb-3 flex-fill">
                <Form.Label>Fecha de Nacimiento</Form.Label>
                <Form.Control
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>

            <div className="d-flex gap-3">
              <Form.Group className="mb-3 flex-fill">
                <Form.Label>Deporte Favorito (opcional)</Form.Label>
                <Form.Control
                  type="text"
                  name="deporte_favorito"
                  placeholder="Ej: Fútbol"
                  value={formData.deporte_favorito}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3 flex-fill">
                <Form.Label>Veces por semana</Form.Label>
                <Form.Control
                  type="number"
                  name="frecuencia_semanal"
                  min="0"
                  max="7"
                  placeholder="0"
                  value={formData.frecuencia_semanal}
                  onChange={handleChange}
                  disabled={!formData.deporte_favorito}
                />
              </Form.Group>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Mínimo 8 caracteres"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Repetir Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="confirm_password"
                placeholder="Confirma tu contraseña"
                value={formData.confirm_password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {error && (
              <p className="text-danger fw-bold text-center">{error}</p>
            )}

            <button type="submit" className="btn-registrar">
              REGISTRARSE
            </button>

            <Link to="/Login" className="link-volver">
              Volver al inicio
            </Link>
          </Form>
        </div>
      </main>
    </div>
  )
}

export default Register
