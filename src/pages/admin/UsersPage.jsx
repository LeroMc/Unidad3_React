import { useEffect, useMemo, useState } from "react"
import { Badge, Button, Card, Form, Spinner, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import UserFormModal from "../../components/users/UserFormModal"
import { getUser } from "../../services/authService"
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../../services/userService"
import "../../styles/gestionUsuarios.css"

const roleLabels = {
  admin: "Administrador",
  coach: "Coach",
  user: "Usuario",
}

function UsersPage() {
  const adminActual = getUser()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [busqueda, setBusqueda] = useState("")
  const [filtroRol, setFiltroRol] = useState("")

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await getUsers()
      setUsers(data.data)
    } catch (error) {
      Swal.fire("Error", error.message, "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const openCreateModal = () => {
    setSelectedUser(null)
    setShowModal(true)
  }

  const openEditModal = (user) => {
    setSelectedUser(user)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedUser(null)
  }

  const handleSave = async (formData) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, formData)
        Swal.fire("Actualizado", "Usuario actualizado correctamente", "success")
      } else {
        await createUser(formData)
        Swal.fire("Creado", "Usuario creado correctamente", "success")
      }
      closeModal()
      loadUsers()
    } catch (error) {
      Swal.fire("Error", error.message, "error")
    }
  }

  const handleDelete = async (user) => {
    if (user.id === adminActual?.id) {
      Swal.fire("Atención", "No puedes eliminar tu propio usuario.", "warning")
      return
    }

    const result = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: `Se eliminará a ${user.full_name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    })

    if (result.isConfirmed) {
      try {
        await deleteUser(user.id)
        Swal.fire("Eliminado", "Usuario eliminado correctamente", "success")
        loadUsers()
      } catch (error) {
        Swal.fire("Error", error.message, "error")
      }
    }
  }

  const usuariosFiltrados = useMemo(() => {
    return users.filter((u) => {
      const coincideNombre = u.full_name?.toLowerCase().includes(busqueda.toLowerCase())
      const coincideRol = filtroRol === "" || u.role === filtroRol
      return coincideNombre && coincideRol
    })
  }, [users, busqueda, filtroRol])

  return (
    <main className="caja-principal gestion-usuarios-page">
      <Card className="shadow-sm" style={{ width: "100%" }}>
        <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h4 className="mb-0">Gestión de Usuarios</h4>
          <Button className="btn-role" onClick={openCreateModal}>
            + Nuevo Usuario
          </Button>
        </Card.Header>
        <Card.Body>
          <p className="text-muted">
            Administra los usuarios del sistema, cambia roles y gestiona permisos.
          </p>

          <div className="toolbar">
            <Form.Control
              type="text"
              placeholder="Buscar usuario..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{ maxWidth: "260px" }}
            />
            <Form.Select
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
              style={{ maxWidth: "200px" }}
            >
              <option value="">Filtrar por Rol</option>
              <option value="admin">Admin</option>
              <option value="coach">Coach</option>
              <option value="user">User</option>
            </Form.Select>
          </div>

          {loading ? (
            <div className="text-center p-4">
              <Spinner animation="border" />
              <p className="mt-2">Cargando usuarios...</p>
            </div>
          ) : (
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>
                      <Badge className={`badge-rol ${user.role}`} bg="">
                        {roleLabels[user.role] || user.role}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => openEditModal(user)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={user.id === adminActual?.id}
                        title={user.id === adminActual?.id ? "No puedes eliminar tu propio usuario" : ""}
                        onClick={() => handleDelete(user)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
                {usuariosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center text-muted">
                      No se encontraron usuarios.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>

        <UserFormModal
          show={showModal}
          handleClose={closeModal}
          handleSave={handleSave}
          selectedUser={selectedUser}
        />
      </Card>
    </main>
  )
}

export default UsersPage
