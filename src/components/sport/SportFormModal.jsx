import { useState, useEffect } from "react"
import { Modal, Button, Form } from "react-bootstrap"

const initialForm = { name: "", objective: "", duration: "", status: true }

function SportFormModal({ show, handleClose, handleSave, selectedSport }) {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (selectedSport) {
      setFormData({
        name: selectedSport.name || "",
        objective: selectedSport.objective || "",
        duration: selectedSport.duration !== undefined ? String(selectedSport.duration) : "",
        status: selectedSport.status !== undefined ? selectedSport.status : true,
      })
    } else {
      setFormData(initialForm)
    }
    setErrors({})
  }, [selectedSport, show])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim() || formData.name.trim().length < 3)
      newErrors.name = "El nombre es obligatorio y debe tener al menos 3 caracteres."
    if (!formData.objective.trim() || formData.objective.trim().length < 5)
      newErrors.objective = "El objetivo es obligatorio y debe tener al menos 5 caracteres."
    const dur = Number(formData.duration)
    if (!formData.duration || !Number.isInteger(dur) || dur < 1)
      newErrors.duration = "La duración es obligatoria y debe ser un número entero mayor a 0."
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      handleSave({ ...formData, duration: Number(formData.duration) })
    }
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          {selectedSport ? "✏️ Editar Deporte" : "🏆 Nuevo Deporte"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Nombre del Deporte *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Ej: CrossFit, Spinning, Boxeo"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Objetivo *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="objective"
              placeholder="Describe el objetivo principal de esta disciplina..."
              value={formData.objective}
              onChange={handleChange}
              isInvalid={!!errors.objective}
            />
            <Form.Control.Feedback type="invalid">{errors.objective}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Duración (minutos) *</Form.Label>
            <Form.Control
              type="number"
              name="duration"
              placeholder="Ej: 60"
              min="1"
              value={formData.duration}
              onChange={handleChange}
              isInvalid={!!errors.duration}
            />
            <Form.Control.Feedback type="invalid">{errors.duration}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Check
              type="switch"
              id="sport-status-switch"
              name="status"
              label={formData.status ? "Estado: Activo" : "Estado: Inactivo"}
              checked={formData.status}
              onChange={handleChange}
              className="fw-semibold"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button variant="primary" type="submit">
            {selectedSport ? "Guardar Cambios" : "Registrar Deporte"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default SportFormModal
