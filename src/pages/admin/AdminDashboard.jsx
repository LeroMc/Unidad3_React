import { Link } from "react-router-dom"
import { getUser } from "../../services/authService"

function AdminDashboard() {
  const user = getUser()

  return (
    <>
      <div className="caja-bienvenida">
        <h1>Panel de Administración</h1>
        <p>Bienvenido, {user?.full_name}</p>
      </div>

      <main className="caja-principal">
        <section className="panel gestion-usuarios">
          <h2>Gestión de Usuarios</h2>
          <p>Administra cuentas, roles y permisos de todo el sistema.</p>
          <Link to="/admin/users">Gestionar Usuarios</Link>
        </section>

        <div className="columna-derecha">
          <section className="panel">
            <h2>Control de Clases</h2>
            <div className="item-clase">
              <span>Spinning / Coach: Carlos / Lunes</span>
              <button>Modificar</button>
            </div>
            <div className="item-clase">
              <span>CrossFit / Coach: Ana / Martes</span>
              <button>Modificar</button>
            </div>
            <div className="item-clase">
              <span>Zumba / Coach: María / Miércoles</span>
              <button>Modificar</button>
            </div>
            <div className="item-clase">
              <span>Yoga / Coach: Elena / Sábados</span>
              <button>Modificar</button>
            </div>
          </section>

          <section className="panel">
            <h2>Reportes del Gimnasio</h2>
            <div className="item-clase">
              <span>Usuarios Activos: 250</span>
              <button>Ver Lista</button>
            </div>
            <div className="item-clase">
              <span>Ingresos del Mes: $4.250.000</span>
              <button>Detalles</button>
            </div>
            <div className="item-clase">
              <span>Reporte de Actividades</span>
              <button>Detalles</button>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default AdminDashboard
