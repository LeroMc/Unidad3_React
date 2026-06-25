import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Form, Spinner } from "react-bootstrap"
import Swal from "sweetalert2"
import {
  changeMyPassword,
  getMe,
  getUser,
  updateMe,
  updateStoredUser,
} from "../services/authService"
import logo from "../assets/images/logo1.png"
import avatar from "../assets/images/logousuario.webp"
import "../styles/Profile.css"

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(getUser())
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState(false)

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    birth_date: "",
  })

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  })

  const cargarFormulario = (datosUsuario) => {
    setFormData({
      full_name: datosUsuario?.full_name || "",
      email: datosUsuario?.email || "",
      birth_date: datosUsuario?.birth_date ? datosUsuario.birth_date.split("T")[0] : "",
    })
  }

  const loadProfile = async () => {
    try {
      setLoading(true)
      const data = await getMe()
      setUser(data.data)
      updateStoredUser(data.data)
      cargarFormulario(data.data)
    } catch (error) {
      Swal.fire("Error", error.message, "error")
      cargarFormulario(getUser())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handlePasswordChange = (event) => {
    const { name, value } = event.target
    setPasswordData({ ...passwordData, [name]: value })
  }

  const handleVolver = () => {
    const role = user?.role
    if (role === "admin") navigate("/admin/dashboard")
    else if (role === "coach") navigate("/coach/dashboard")
    else navigate("/user/dashboard")
  }

  const handleGuardarInfo = async () => {
    try {
      const data = await updateMe({
        full_name: formData.full_name,
        email: formData.email,
        birth_date: formData.birth_date || null,
      })
      setUser(data.data)
      updateStoredUser(data.data)
      await Swal.fire("Actualizado", "Perfil actualizado correctamente", "success")
      setEditando(false)
    } catch (error) {
      Swal.fire("Error", error.message, "error")
    }
  }

  const handleActualizarContrasena = async () => {
    const { current_password, new_password, confirm_password } = passwordData

    if (!current_password || !new_password || !confirm_password) {
      Swal.fire("Atención", "Completa todos los campos de contraseña.", "warning")
      return
    }
    if (new_password.length < 8) {
      Swal.fire("Atención", "La nueva contraseña debe tener al menos 8 caracteres.", "warning")
      return
    }
    if (new_password !== confirm_password) {
      Swal.fire("Atención", "Las contraseñas no coinciden.", "warning")
      return
    }

    try {
      await changeMyPassword({ current_password, new_password, confirm_password })
      await Swal.fire("Actualizado", "Contraseña actualizada correctamente", "success")
      setPasswordData({ current_password: "", new_password: "", confirm_password: "" })
    } catch (error) {
      Swal.fire("Error", error.message, "error")
    }
  }

  const deportes = user?.metadata?.sports || []

  return (
    <div className="perfil-theme">
      <header>
        <img src={logo} alt="Logo SportClub" />
        <h1>MI PERFIL</h1>
        <button className="btn-volver" onClick={handleVolver}>⬅ Volver</button>
      </header>

      {loading ? (
        <div className="text-center text-white p-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <main className="contenido">
          <aside className="barra-perfil">
            <div className="foto-usuario">
              <img src={avatar} alt="Usuario" />
              <h2>{user?.full_name}</h2>
              <span className={`badge-rol ${user?.role}`}>{user?.role?.toUpperCase()}</span>
            </div>

            <div className="info-item">
              <span>📧</span>
              <div>
                <span className="info-campo">Email</span>
                <span className="info-valor">{user?.email}</span>
              </div>
            </div>
            <div className="info-item">
              <span>🛡️</span>
              <div>
                <span className="info-campo">Rol</span>
                <span className="info-valor">{user?.role}</span>
              </div>
            </div>

            {deportes.length > 0 && (
              <div className="info-item">
                <span>🏅</span>
                <div>
                  <span className="info-campo">Deportes</span>
                  {deportes.map((deporte, index) => (
                    <span className="info-valor d-block" key={`${deporte.name}-${index}`}>
                      {deporte.name} ({deporte.frequency_per_week}x semana)
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>

          <section className="caja-blanca">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="mb-0">Información Personal</h3>
              <Button size="sm" variant="warning" onClick={() => setEditando(!editando)}>
                ✏️ {editando ? "Cancelar" : "Editar Perfil"}
              </Button>
            </div>

            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nombre Completo</Form.Label>
                <Form.Control
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  disabled={!editando}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!editando}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fecha de Nacimiento</Form.Label>
                <Form.Control
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  disabled={!editando}
                />
              </Form.Group>

              {editando && (
                <Button variant="primary" onClick={handleGuardarInfo}>
                  Guardar Cambios
                </Button>
              )}
            </Form>
          </section>

          <section className="caja-blanca">
            <h3>Seguridad / Cambiar Contraseña</h3>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Contraseña Actual</Form.Label>
                <Form.Control
                  type="password"
                  name="current_password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Nueva Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="new_password"
                  placeholder="Mínimo 8 caracteres"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Confirmar Nueva Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                />
              </Form.Group>
              <Button variant="success" onClick={handleActualizarContrasena}>
                Actualizar Contraseña
              </Button>
            </Form>
          </section>
        </main>
      )}
    </div>
  )
}

export default Profile
