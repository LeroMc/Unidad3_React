/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useMemo } from "react"
import { Badge, Button, Card, Col, Form, Row, Spinner, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import {
  getSports,
  createSport,
  updateSport,
  deleteSport,
  changeSportStatus,
} from "../../services/sportService"
import SportFormModal from "../../components/sport/SportFormModal"

function formatDate(dateStr) {
  if (!dateStr) return "—"
  const date = new Date(dateStr)
  return date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
}

function SportsPage() {
  const [sports, setSports] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [selectedSport, setSelectedSport] = useState(null)

  const loadSports = async () => {
    setLoading(true)
    try {
      const data = await getSports()
      setSports(Array.isArray(data) ? data : [])
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: error.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSports()
  }, [])

  const filteredSports = useMemo(() => {
    return sports.filter((sport) => {
      const matchesSearch =
        sport.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sport.objective?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && sport.status === true) ||
        (statusFilter === "inactive" && sport.status === false)
      return matchesSearch && matchesStatus
    })
  }, [sports, searchTerm, statusFilter])

  const openCreateModal = () => { setSelectedSport(null); setShowModal(true) }
  const openEditModal = (sport) => { setSelectedSport(sport); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setSelectedSport(null) }

  const handleSave = async (formData) => {
    try {
      if (selectedSport) {
        await updateSport(selectedSport.id, formData)
        Swal.fire({ icon: "success", title: "Actualizado", text: "Deporte actualizado correctamente.", timer: 1800, showConfirmButton: false })
      } else {
        await createSport(formData)
        Swal.fire({ icon: "success", title: "Creado", text: "Deporte registrado correctamente.", timer: 1800, showConfirmButton: false })
      }
      closeModal()
      loadSports()
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error al guardar", text: error.message })
    }
  }

  const handleDelete = async (sport) => {
    const result = await Swal.fire({
      title: "¿Está seguro de eliminar este deporte?",
      text: `Se eliminará "${sport.name}" de forma permanente.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })
    if (result.isConfirmed) {
      try {
        await deleteSport(sport.id)
        Swal.fire({ icon: "success", title: "Eliminado", text: "El deporte fue eliminado.", timer: 1500, showConfirmButton: false })
        loadSports()
      } catch (error) {
        Swal.fire({ icon: "error", title: "Error", text: error.message })
      }
    }
  }

  const handleStatusToggle = async (sport) => {
    const newStatus = !sport.status
    try {
      await changeSportStatus(sport.id, newStatus)
      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        text: `"${sport.name}" ahora está ${newStatus ? "Activo" : "Inactivo"}.`,
        timer: 1500,
        showConfirmButton: false,
      })
      loadSports()
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: error.message })
    }
  }

  return (
    <main className="container-fluid py-4">
      <Card className="shadow-sm">
        <Card.Header className="admin-card-header d-flex justify-content-between align-items-center py-3">
          <h4 className="mb-0">🏆 Gestión de Deportes</h4>
          <div className="d-flex gap-2">
            <Button variant="light" onClick={loadSports} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "🔄 Refrescar"}
            </Button>
            <Button variant="warning" className="text-dark fw-semibold" onClick={openCreateModal}>➕ Nuevo Deporte</Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3 g-2">
            <Col md={7}>
              <Form.Control
                type="text"
                placeholder="Buscar por nombre u objetivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col md={5}>
              <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">Todos los estados</option>
                <option value="active">Solo Activos</option>
                <option value="inactive">Solo Inactivos</option>
              </Form.Select>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" style={{ color: "rgb(191,44,44)" }} />
              <p className="mt-2 text-muted">Cargando deportes...</p>
            </div>
          ) : filteredSports.length === 0 ? (
            <div className="alert alert-info text-center">No se encontraron deportes.</div>
          ) : (
            <Table striped hover responsive className="mb-0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Objetivo</th>
                  <th>Duración</th>
                  <th>Estado</th>
                  <th>Fecha Creación</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredSports.map((sport) => (
                  <tr key={sport.id}>
                    <td><strong>{sport.id}</strong></td>
                    <td className="fw-bold text-primary">{sport.name}</td>
                    <td>
                      <span className="text-muted small" style={{ display: "inline-block", maxWidth: 280 }}>
                        {sport.objective}
                      </span>
                    </td>
                    <td>{sport.duration} min</td>
                    <td>
                      <Form.Check
                        type="switch"
                        id={`switch-${sport.id}`}
                        checked={sport.status}
                        onChange={() => handleStatusToggle(sport)}
                        label={
                          <Badge bg={sport.status ? "success" : "danger"}>
                            {sport.status ? "Activo" : "Inactivo"}
                          </Badge>
                        }
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                    <td className="small text-muted">{formatDate(sport.created_at)}</td>
                    <td className="text-end">
                      <Button className="btn-admin-edit" size="sm" className="me-2" onClick={() => openEditModal(sport)}>
                        ✏️ Editar
                      </Button>
                      <Button className="btn-admin-delete" size="sm" onClick={() => handleDelete(sport)}>
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

      <SportFormModal
        show={showModal}
        handleClose={closeModal}
        handleSave={handleSave}
        selectedSport={selectedSport}
      />
    </main>
  )
}

export default SportsPage
