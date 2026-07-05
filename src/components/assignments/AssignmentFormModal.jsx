/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react"
import { Modal, Button, Form, Alert } from "react-bootstrap"

const initial = { sport_id: "", room_id: "", coach_id: "", observation: "", status: true }

function AssignmentFormModal({ show, handleClose, handleSave, selectedAssignment, sports, rooms, coaches }) {
  const [formData, setFormData] = useState(initial)
  const [errors, setErrors] = useState([])

  useEffect(() => {
    if (selectedAssignment) {
      setFormData({
        sport_id: selectedAssignment.sport_id || "",
        room_id: selectedAssignment.room_id || "",
        coach_id: selectedAssignment.coach_id || "",
        observation: selectedAssignment.observation || "",
        status: selectedAssignment.status !== undefined ? selectedAssignment.status : true,
      })
    } else { setFormData(initial) }
    setErrors([])
  }, [selectedAssignment, show])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  const validate = () => {
    const err = []
    if (!formData.sport_id) err.push("Debe seleccionar un deporte.")
    if (!formData.room_id) err.push("Debe seleccionar una sala.")
    if (!formData.coach_id) err.push("Debe seleccionar un coach.")
    setErrors(err)
    return err.length === 0
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (validate()) handleSave({ ...formData, sport_id: Number(formData.sport_id), room_id: Number(formData.room_id), coach_id: Number(formData.coach_id) })
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>{selectedAssignment ? "✏️ Editar Asignación" : "🔗 Nueva Asignación"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          {errors.length > 0 && <Alert variant="danger">{errors.map((e, i) => <div key={i}>{e}</div>)}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Deporte *</Form.Label>
            <Form.Select name="sport_id" value={formData.sport_id} onChange={handleChange}>
              <option value="">Seleccionar deporte...</option>
              {sports.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Sala *</Form.Label>
            <Form.Select name="room_id" value={formData.room_id} onChange={handleChange}>
              <option value="">Seleccionar sala...</option>
              {rooms.map((r) => <option key={r.id} value={r.id}>{r.name} (cap. {r.capacity})</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Coach *</Form.Label>
            <Form.Select name="coach_id" value={formData.coach_id} onChange={handleChange}>
              <option value="">Seleccionar coach...</option>
              {coaches.map((c) => <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Observación</Form.Label>
            <Form.Control type="text" name="observation" value={formData.observation} onChange={handleChange} placeholder="Notas adicionales..." />
          </Form.Group>
          <Form.Check type="switch" id="assign-status" name="status" label={formData.status ? "Estado: Activo" : "Estado: Inactivo"} checked={formData.status} onChange={handleChange} className="fw-semibold" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button variant="primary" type="submit">{selectedAssignment ? "Guardar Cambios" : "Crear Asignación"}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default AssignmentFormModal
