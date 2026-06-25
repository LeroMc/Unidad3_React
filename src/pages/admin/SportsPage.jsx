import { useState, useEffect, useMemo } from "react";
import { Card, Table, Button, Form, Row, Col, Badge, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { getSports, createSport, updateSport, deleteSport, changeSportStatus } from "../../services/sportService";
import SportFormModal from "../../components/sport/SportFormModal";
import "../../styles/admin.css";

function SportsPage() {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("all");

  
  const [showModal, setShowModal] = useState(false);
  const [selectedSport, setSelectedSport] = useState(null);

  const loadSports = async () => {
    setLoading(true);
    try {
      const response = await getSports();
      
      if (response && Array.isArray(response)) {
        setSports(response);
      } else if (response && response.data && Array.isArray(response.data)) {
        setSports(response.data);
      } else {
        setSports([]);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error de Conexión",
        text: error.message || "No se pudo recuperar el listado de deportes."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSports();
  }, []);

  
  const filteredSports = useMemo(() => {
    return sports.filter((sport) => {
      const matchesSearch =
        (sport.name && sport.name.toLowerCase().includes(busqueda.toLowerCase())) ||
        (sport.description && sport.description.toLowerCase().includes(busqueda.toLowerCase()));

      const matchesFilter =
        filtroEstado === "all" ||
        (filtroEstado === "active" && sport.status === true) ||
        (filtroEstado === "inactive" && sport.status === false);

      return matchesSearch && matchesFilter;
    });
  }, [sports, busqueda, filtroEstado]);

  const openCreateModal = () => {
    setSelectedSport(null);
    setShowModal(true);
  };

  const openEditModal = (sport) => {
    setSelectedSport(sport);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSport(null);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedSport) {
        
        await updateSport(selectedSport.id, formData);
        Swal.fire({
          icon: "success",
          title: "¡Excelente!",
          text: "El deporte ha sido actualizado correctamente.",
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        
        await createSport(formData);
        Swal.fire({
          icon: "success",
          title: "¡Creado!",
          text: "El deporte ha sido registrado exitosamente.",
          timer: 2000,
          showConfirmButton: false
        });
      }
      closeModal();
      loadSports(); 
    } catch (error) {
      const detailedError = error.message || "Por favor, revisa las validaciones de campos.";

  Swal.fire({
    icon: "error",
    title: "Error al guardar",
    text: detailedError
  });
}
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer. Se eliminará la disciplina deportiva de forma permanente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        await deleteSport(id);
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "El deporte ha sido removido de la base de datos.",
          timer: 1500,
          showConfirmButton: false
        });
        loadSports(); 
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "No se pudo eliminar el deporte."
        });
      }
    }
  };

  const handleStatusToggle = async (sport) => {
    const newStatus = !sport.status;
    try {
      await changeSportStatus(sport.id, newStatus);
      Swal.fire({
        icon: "success",
        title: "Estado Actualizado",
        text: `La disciplina deportiva ahora está ${newStatus ? "Activa" : "Inactiva"}.`,
        timer: 1500,
        showConfirmButton: false
      });
      loadSports(); 
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo alterar el estado del deporte."
      });
    }
  };

  return (
    <main className="container-fluid py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3">
          <h4 className="mb-0">🏆 Gestión de Deportes</h4>
          <div className="d-flex gap-2">
            <Button variant="light" onClick={loadSports} disabled={loading} title="Forzar recarga manual">
              {loading ? <Spinner animation="border" size="sm" /> : "🔄 Refrescar"}
            </Button>
            <Button variant="success" onClick={openCreateModal}>
              ➕ Nuevo Deporte
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          
          <Row className="mb-4 g-3">
            <Col md={7}>
              <Form.Control
                type="text"
                placeholder="Buscar disciplina por nombre o descripción..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </Col>
            <Col md={5}>
              <Form.Select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                <option value="all">Filtrar por Estado (Todos)</option>
                <option value="active">Solo Activos</option>
                <option value="inactive">Solo Inactivos</option>
              </Form.Select>
            </Col>
          </Row>

          
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Cargando disciplinas deportivas...</p>
            </div>
          ) : filteredSports.length === 0 ? (
            <div className="alert alert-info text-center py-4">
              No se encontraron deportes registrados en el sistema.
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped hover align="middle" className="mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Deporte</th>
                    <th>Descripción</th>
                    <th className="text-center">Estado (Switch)</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSports.map((sport) => (
                    <tr key={sport.id}>
                      <td><strong>#{sport.id}</strong></td>
                      <td>
                        <span className="fw-bold text-primary">{sport.name}</span>
                      </td>
                      <td>
                        <span className="text-muted small d-inline-block text-truncate" style={{ maxWidth: "380px" }}>
                          {sport.description}
                        </span>
                      </td>
                      <td className="text-center">
                        <Form.Check
                          type="switch"
                          id={`switch-status-${sport.id}`}
                          checked={sport.status}
                          onChange={() => handleStatusToggle(sport)}
                          label={
                            sport.status ? (
                              <Badge bg="success">Activo</Badge>
                            ) : (
                              <Badge bg="danger">Inactivo</Badge>
                            )
                          }
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                      <td className="text-end">
                        <Button
                          variant="outline-warning"
                          size="sm"
                          className="me-2"
                          onClick={() => openEditModal(sport)}
                        >
                           Editar
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(sport.id)}
                        >
                          🗑️ Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
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
  );
}

export default SportsPage;