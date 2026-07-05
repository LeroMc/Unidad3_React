/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react"
import { Modal, Button, Form } from "react-bootstrap"

const initial = { name: "", description: "", capacity: "", location: "", observation: "", image_url: "", status: true }

function RoomFormModal({ show, handleClose, handleSave, selectedRoom }) {
  const [formData, setFormData] = useState(initial)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (selectedRoom) {
      setFormData({
        name: selectedRoom.name || "",
        description: selectedRoom.description || "",
        capacity: selectedRoom.capacity !== undefined ? String(selectedRoom.capacity) : "",
        location: selectedRoom.location || "",
        observation: selectedRoom.observation || "",
        image_url: selectedRoom.image_url || "",
        status: selectedRoom.status !== undefined ? selectedRoom.status : true,
      })
    } else { setFormData(initial) }
    setErrors({})
  }, [selectedRoom, show])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  const validate = () => {
    const err = {}
    if (!formData.name.trim() || formData.name.trim().length < 3) err.name = "El nombre debe tener al menos 3 caracteres."
    if (!formData.description.trim() || formData.description.trim().length < 5) err.description = "La descripción debe tener al menos 5 caracteres."
    if (!formData.capacity || Number(formData.capacity) < 1) err.capacity = "La capacidad debe ser mayor a 0."
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (validate()) handleSave({ ...formData, capacity: Number(formData.capacity) })
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>{selectedRoom ? "✏️ Editar Sala" : "🏟️ Nueva Sala"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Nombre *</Form.Label>
            <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} isInvalid={!!errors.name} placeholder="Ej: Sala Principal" />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Descripción *</Form.Label>
            <Form.Control as="textarea" rows={2} name="description" value={formData.description} onChange={handleChange} isInvalid={!!errors.description} placeholder="Describe la sala..." />
            <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
          </Form.Group>
          <div className="row g-2">
            <div className="col-6">
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Capacidad *</Form.Label>
                <Form.Control type="number" name="capacity" min="1" value={formData.capacity} onChange={handleChange} isInvalid={!!errors.capacity} placeholder="Ej: 30" />
                <Form.Control.Feedback type="invalid">{errors.capacity}</Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-6">
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Ubicación</Form.Label>
                <Form.Control type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Ej: Piso 2" />
              </Form.Group>
            </div>
          </div>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">URL Imagen</Form.Label>
            <Form.Control type="text" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://..." />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Observación</Form.Label>
            <Form.Control type="text" name="observation" value={formData.observation} onChange={handleChange} placeholder="Notas adicionales..." />
          </Form.Group>
          <Form.Check type="switch" id="room-status" name="status" label={formData.status ? "Estado: Activo" : "Estado: Inactivo"} checked={formData.status} onChange={handleChange} className="fw-semibold" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button variant="primary" type="submit">{selectedRoom ? "Guardar Cambios" : "Crear Sala"}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default RoomFormModal
