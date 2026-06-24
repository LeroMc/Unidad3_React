# SportClub - SPA con React

Proyecto de Unidad 3 (Evaluación N° 3) — Sistema SportClub desarrollado con React, React Router, 
React-Bootstrap y SweetAlert2. Incluye autenticación,
registro, control de acceso por roles, dashboards diferenciados por rol y un módulo
administrativo CRUD de usuarios, consumiendo el backend **FrontEnd-Backend-ClubDeportivo**.

## Integrantes

- (Matias Andres Codoceo Guerra)

## Estructura del proyecto (frontend)

```text
├── assets/images/      # Logo y recursos gráficos
├── components/users/   # UserFormModal.jsx (crear/editar usuario)
├── layouts/             # AdminLayout, UserLayout, CoachLayout
├── pages/
│   ├── admin/           # AdminDashboard, UsersPage (CRUD)
│   ├── coach/           # CoachDashboard
│   ├── user/            # UserDashboard
│   ├── Home.jsx, Login.jsx, Registro.jsx, Perfil.jsx, Unauthorized.jsx
├── routes/              # AppRoutes, ProtectedRoute, RoleRoute
├── services/            # authService.js, userService.js, apiError.js
└── styles/              # CSS por módulo / rol
```

## Cómo instalar las dependencias (frontend)
Primero abrir la terminal en la carpeta del proyecto de FrontEnd y ejecutar los siguientes comandos:
```bash
npm install
```
## Cómo ejecutar el frontend
Abrir la terminal en el proyecto y ejecutar el siguiente comando
```bash
npm run dev
```
La aplicación quedara disponible en `http://localhost:5173`.

## Cómo ejecutar el backend
Abrir la carpeta del backend que se entrego en clases anteriores y abril la terminal para poner 
los siguientes comandos
```bash
npm install
cp .env.example .env     
npm run dev
```
Este proyecto consume el backend entregado en el curso (Node.js + Express + Sequelize).
El servidor quedara disponible en `http://localhost:3000`. Si se cambia el puerto u otra
configuración, se debera ajustar la `API_URL` en `src/services/authService.js` y `src/services/userService.js`
del frontend.

## Tecnologías utilizadas
- React 19 + Vite
- React Router DOM (rutas y rutas protegidas)
- React-Bootstrap + Bootstrap 5 (UI y Modal)
- SweetAlert2 (confirmaciones y mensajes)
- Fetch API (consumo del backend)
- LocalStorage (persistencia de sesión)
- Backend: Node.js + Express + Sequelize (SQLite) + JWT + bcryptjs

