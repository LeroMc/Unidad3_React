/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react"
import { Badge, Button, Card, Col, Form, Row, Spinner, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import UserFormModal from "../../components/users/UserFormModal"
import { getUser } from "../../services/authService"
import { createUser, deleteUser, getUsers, updateUser } from "../../services/userService"

const ROLE_LABELS = { admin: "Administrador", coach: "Coach", user: "Usuario" }

function UsersPage() {
  const currentAdmin = getUser()
  const [users, setUsers]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [showModal, setShowModal]   = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("")

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await getUsers()
      setUsers(data.data || [])
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadUsers() }, [])

  const openCreate = () => { setSelectedUser(null); setShowModal(true) }
  const openEdit   = (u) => { setSelectedUser(u);    setShowModal(true) }
  const closeModal = ()  => { setShowModal(false);   setSelectedUser(null) }

  const handleSave = async (formData) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, formData)
        Swal.fire({ icon: "success", title: "Actualizado", text: "Usuario actualizado correctamente.", timer: 1800, showConfirmButton: false })
      } else {
        await createUser(formData)
        Swal.fire({ icon: "success", title: "Creado", text: "Usuario creado correctamente.", timer: 1800, showConfirmButton: false })
      }
      closeModal()
      loadUsers()
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message })
    }
  }

  const handleDelete = async (user) => {
    if (user.id === currentAdmin?.id) {
      Swal.fire({ icon: "warning", title: "Atención", text: "No puedes eliminar tu propio usuario." })
      return
    }
    const result = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: `Se eliminará a ${user.full_name}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })
    if (result.isConfirmed) {
      try {
        await deleteUser(user.id)
        Swal.fire({ icon: "success", title: "Eliminado", text: "Usuario eliminado correctamente.", timer: 1500, showConfirmButton: false })
        loadUsers()
      } catch (err) {
        Swal.fire({ icon: "error", title: "Error", text: err.message })
      }
    }
  }

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = roleFilter === "" || u.role === roleFilter
      return matchesSearch && matchesRole
    })
  }, [users, searchTerm, roleFilter])

  return (
    <main className="container-fluid py-4">
      <Card className="shadow-sm">
        <Card.Header className="admin-card-header d-flex justify-content-between align-items-center flex-wrap gap-2 py-3">
          <h4 className="mb-0">👥 Gestión de Usuarios</h4>
          <div className="d-flex gap-2">
            <Button variant="light" onClick={loadUsers} disabled={loading}>
              {loading ? <Spinner size="sm" animation="border" /> : "🔄 Refrescar"}
            </Button>
            <Button variant="warning" className="text-dark fw-semibold" onClick={openCreate}>
              ➕ Nuevo Usuario
            </Button>
          </div>
        </Card.Header>

        <Card.Body>
          <p className="text-muted mb-3">Administra los usuarios del sistema, cambia roles y gestiona permisos.</p>

          {/* Toolbar */}
          <Row className="g-2 mb-3">
            <Col md={7}>
              <Form.Control
                type="text"
                placeholder="Buscar por nombre o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col md={5}>
              <Form.Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="">Todos los roles</option>
                <option value="admin">Administrador</option>
                <option value="coach">Coach</option>
                <option value="user">Usuario</option>
              </Form.Select>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" style={{ color: "rgb(191,44,44)" }} />
              <p className="mt-2 text-muted">Cargando usuarios...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="alert alert-info text-center">No se encontraron usuarios.</div>
          ) : (
            <Table striped hover responsive className="mb-0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td><strong>#{user.id}</strong></td>
                    <td className="fw-semibold">{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>
                      <Badge className={`badge-rol ${user.role}`} bg="">
                        {ROLE_LABELS[user.role] || user.role}
                      </Badge>
                    </td>
                    <td className="text-end">
                      <Button
                        className="btn-admin-edit me-2"
                        size="sm"
                        onClick={() => openEdit(user)}
                      >
                        ✏️ Editar
                      </Button>
                      <Button
                        className="btn-admin-delete"
                        size="sm"
                        disabled={user.id === currentAdmin?.id}
                        title={user.id === currentAdmin?.id ? "No puedes eliminar tu propio usuario" : ""}
                        onClick={() => handleDelete(user)}
                      >
                        🗑️ Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <UserFormModal
        show={showModal}
        handleClose={closeModal}
        handleSave={handleSave}
        selectedUser={selectedUser}
      />
    </main>
  )
}

export default UsersPage
