import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function SportFormModal({ show, handleClose, handleSave, selectedSport }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedSport) {
      setFormData({
        name: selectedSport.name || "",
        description: selectedSport.description || "",
        status: selectedSport.status !== undefined ? selectedSport.status : true
      });
    } else {
      setFormData({
        name: "",
        description: "",
        status: true
      });
    }
    setErrors({});
  }, [selectedSport, show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "El nombre del deporte es obligatorio.";
    } else if (formData.name.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres.";
    }
    if (!formData.description.trim()) {
      newErrors.description = "La descripción de la disciplina es obligatoria.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      handleSave(formData);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          {selectedSport ? "✏️ Editar Disciplina" : "🏆 Agregar Nueva Disciplina"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="sportName">
            <Form.Label className="fw-semibold">Nombre del Deporte</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Ej: Spinning, CrossFit, Boxeo, Natación"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="sportDescription">
            <Form.Label className="fw-semibold">Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              placeholder="Escribe una breve descripción del deporte, sus beneficios y requerimientos..."
              value={formData.description}
              onChange={handleChange}
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="sportStatus">
            <Form.Check
              type="switch"
              id="status-switch"
              name="status"
              label={formData.status ? "Deporte Activo" : "Deporte Inactivo"}
              checked={formData.status}
              onChange={handleChange}
              className="fw-semibold text-muted"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {selectedSport ? "Guardar Cambios" : "Registrar Deporte"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default SportFormModal;