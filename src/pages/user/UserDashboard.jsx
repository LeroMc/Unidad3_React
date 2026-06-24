import { getUser } from "../../services/authService"

function UserDashboard() {
  const user = getUser()

  return (
    <>
      <div className="caja-bienvenida">
        <h1>Bienvenido a SportClub</h1>
        <p>Hola, {user?.full_name}</p>
      </div>

      <main className="caja-principal">
        <section className="panel" style={{ maxWidth: "340px" }}>
          <h2>Mi Perfil</h2>
          <p><strong>Nombre:</strong> {user?.full_name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <h3>Objetivos Personales</h3>
          <ul>
            <li>Mejorar resistencia cardiovascular</li>
            <li>Aumentar masa muscular</li>
            <li>Asistir 3 veces por semana</li>
          </ul>
        </section>

        <div className="columna-derecha">
          <section className="panel">
            <h2>Clases Disponibles</h2>
            <div className="item-clase">
              <span>Spinning</span>
              <button>Reservar</button>
            </div>
            <div className="item-clase">
              <span>CrossFit</span>
              <button>Reservar</button>
            </div>
            <div className="item-clase">
              <span>Zumba</span>
              <button>Reservar</button>
            </div>
          </section>

          <section className="panel">
            <h2>Horario de Clases</h2>
            <div className="item-clase">
              <span>Spinning / Lunes / 10:00-14:00</span>
              <button>Reservar</button>
            </div>
            <div className="item-clase">
              <span>Boxeo / Lunes / 14:00-19:00</span>
              <button>Reservar</button>
            </div>
            <div className="item-clase">
              <span>CrossFit / Miércoles / 09:00-12:00</span>
              <button>Reservar</button>
            </div>
            <div className="item-clase">
              <span>Zumba / Viernes / 18:00-20:00</span>
              <button>Reservar</button>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default UserDashboard
