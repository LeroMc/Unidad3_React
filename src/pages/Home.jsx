import { Link } from "react-router-dom"
import logo from "../assets/images/logo1.png"
import "../styles/landing.css"

function Home() {
  return (
    <div className="landing-theme">
      <header>
        <div className="logo-container">
          <img src={logo} alt="Logo SportClub" />
        </div>
        <nav>
          <ul className="menus">
            <li><a href="#clases">Clases</a></li>
            <li><Link to="/Login" className="btn-nav">Iniciar Sesión</Link></li>
            <li><Link to="/Register" className="btn-nav highlight">Registrarse</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="inicio">
          <div className="panel-bienvenida">
            <h1>BIENVENIDO A SPORTCLUB</h1>
            <p>Lleva tu entrenamiento al siguiente nivel con los mejores profesionales.</p>
            <Link to="/Register" className="btn-principal">Comenzar Ahora</Link>
          </div>
        </section>

        <section id="clases" className="clases-destacadas">
          <h2 className="text-center">Nuestras Disciplinas</h2>
          <div className="cuadrito-clases">
            <div className="clase-panel">
              <h3>Spinning</h3>
              <p>Mejora tu resistencia cardiovascular al ritmo de la mejor música.</p>
            </div>
            <div className="clase-panel">
              <h3>CrossFit</h3>
              <p>Entrenamiento de alta intensidad para superar tus límites.</p>
            </div>
            <div className="clase-panel">
              <h3>Boxeo</h3>
              <p>Disciplina, técnica y un entrenamiento completo de cuerpo y mente.</p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>© 2026 SportClub</p>
      </footer>
    </div>
  )
}

export default Home
