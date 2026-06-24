import { getUser } from "../../services/authService"
import avatar from "../../assets/images/logousuario.webp"

const alumnos = ["Alumno 1", "Alumno 2", "Alumno 3"]

function CoachDashboard() {
  const user = getUser()

  return (
    <>
      <div className="caja-bienvenida">
        <h1>Panel de Entrenador</h1>
        <p>Bienvenido, {user?.full_name}</p>
      </div>

      <main className="caja-principal">
        <section className="panel" style={{ flex: "1", minWidth: "300px" }}>
          <h2>Mis Alumnos</h2>
          {alumnos.map((nombre) => (
            <div className="item-clase" key={nombre}>
              <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img src={avatar} alt="Avatar" width={36} style={{ borderRadius: "50%" }} />
                {nombre}
              </span>
              <button>Ver Progreso</button>
            </div>
          ))}
        </section>

        <div className="columna-derecha">
          <section className="panel">
            <h2>Mi Horario</h2>
            <div className="item-clase">
              <span>Lunes / 14:00 - 18:00 / Spinning</span>
              <button>Ver Detalle</button>
            </div>
            <div className="item-clase">
              <span>Martes / 11:00 - 15:00 / Natación</span>
              <button>Ver Detalle</button>
            </div>
            <div className="item-clase">
              <span>Miércoles / 10:00 - 14:00 / CrossFit</span>
              <button>Ver Detalle</button>
            </div>
            <div className="item-clase">
              <span>Viernes / 11:00 - 15:00 / Boxeo</span>
              <button>Ver Detalle</button>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default CoachDashboard
