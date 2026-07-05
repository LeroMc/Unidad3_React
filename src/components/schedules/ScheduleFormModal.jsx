/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react"
import { Modal, Button, Form, Alert } from "react-bootstrap"

const DAYS = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
const initial = { sport_room_id: "", day_of_week: "", start_time: "", end_time: "", status: true }

function ScheduleFormModal({ show, handleClose, handleSave, selectedSchedule, sportRooms }) {
  const [formData, setFormData] = useState(initial)
  const [errors, setErrors] = useState([])

  useEffect(() => {
    if (selectedSchedule) {
      setFormData({
        sport_room_id: selectedSchedule.sport_room_id || "",
        day_of_week: selectedSchedule.day_of_week || "",
        start_time: selectedSchedule.start_time || "",
        end_time: selectedSchedule.end_time || "",
        status: selectedSchedule.status !== undefined ? selectedSchedule.status : true,
      })
    } else { setFormData(initial) }
    setErrors([])
  }, [selectedSchedule, show])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  const validate = () => {
    const err = []
    if (!formData.sport_room_id) err.push("Debe seleccionar una asignación.")
    if (!formData.day_of_week || Number(formData.day_of_week) < 1 || Number(formData.day_of_week) > 7) err.push("Seleccione un día válido (1-7).")
    if (!formData.start_time) err.push("Ingrese la hora de inicio.")
    if (!formData.end_time) err.push("Ingrese la hora de término.")
    if (formData.start_time && formData.end_time && formData.start_time >= formData.end_time) err.push("La hora de inicio debe ser menor que la hora de término.")
    setErrors(err)
    return err.length === 0
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (validate()) handleSave({ ...formData, sport_room_id: Number(formData.sport_room_id), day_of_week: Number(formData.day_of_week) })
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>{selectedSchedule ? "✏️ Editar Horario" : "🕐 Nuevo Horario"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          {errors.length > 0 && <Alert variant="danger">{errors.map((e, i) => <div key={i}>{e}</div>)}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Asignación (Deporte + Sala + Coach) *</Form.Label>
            <Form.Select name="sport_room_id" value={formData.sport_room_id} onChange={handleChange}>
              <option value="">Seleccionar asignación...</option>
              {sportRooms.map((sr) => (
                <option key={sr.id} value={sr.id}>
                  #{sr.id} — {sr.sport?.name || "?"} / {sr.room?.name || "?"} / {sr.coach?.email || "?"}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Día de la semana *</Form.Label>
            <Form.Select name="day_of_week" value={formData.day_of_week} onChange={handleChange}>
              <option value="">Seleccionar día...</option>
              {DAYS.slice(1).map((d, i) => <option key={i + 1} value={i + 1}>{d}</option>)}
            </Form.Select>
          </Form.Group>
          <div className="row g-2">
            <div className="col-6">
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Hora de Inicio *</Form.Label>
                <Form.Control type="time" name="start_time" value={formData.start_time} onChange={handleChange} />
              </Form.Group>
            </div>
            <div className="col-6">
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Hora de Término *</Form.Label>
                <Form.Control type="time" name="end_time" value={formData.end_time} onChange={handleChange} />
              </Form.Group>
            </div>
          </div>
          <Form.Check type="switch" id="sched-status" name="status" label={formData.status ? "Estado: Activo" : "Estado: Inactivo"} checked={formData.status} onChange={handleChange} className="fw-semibold" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button variant="primary" type="submit">{selectedSchedule ? "Guardar Cambios" : "Crear Horario"}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default ScheduleFormModal
