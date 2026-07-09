import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Unauthorized from "../pages/Unauthorized"
import Profile from "../pages/Profile"
// Admin pages
import AdminDashboard from "../pages/admin/AdminDashboard"
import UsersPage from "../pages/admin/UsersPage"
import SportsPage from "../pages/admin/SportsPage"
import RoomsPage from "../pages/admin/RoomsPage"
import AssignmentsPage from "../pages/admin/AssignmentsPage"
import SchedulesPage from "../pages/admin/SchedulesPage"
// Coach pages
import CoachDashboard from "../pages/coach/CoachDashboard"
import MyClassesPage from "../pages/coach/MyClassesPage"
import MySchedulePage from "../pages/coach/MySchedulePage"
// User pages
import UserDashboard from "../pages/user/UserDashboard"
import AvailableClassesPage from "../pages/user/AvailableClassesPage"
import MyReservationsPage from "../pages/user/MyReservationsPage"
// Layouts
import AdminLayout from "../layouts/AdminLayout"
import CoachLayout from "../layouts/CoachLayout"
import UserLayout from "../layouts/UserLayout"
// Route guards
import ProtectedRoute from "./ProtectedRoute"
import RoleRoute from "./RoleRoute"

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/*RutasPublicas*/}
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/*CualquierUsuarioAutenticado*/}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/*RutasUsuario*/}
        <Route
          path="/user"
          element={<RoleRoute allowedRoles={["user"]}><UserLayout /></RoleRoute>}
        >
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="classes" element={<AvailableClassesPage />} />
          <Route path="reservations" element={<MyReservationsPage />} />
        </Route>

        {/*RutasCoach*/}
        <Route
          path="/coach"
          element={<RoleRoute allowedRoles={["coach"]}><CoachLayout /></RoleRoute>}
        >
          <Route path="dashboard" element={<CoachDashboard />} />
          <Route path="my-classes" element={<MyClassesPage />} />
          <Route path="my-schedule" element={<MySchedulePage />} />
        </Route>

        {/*RutasAdmin*/}
        <Route
          path="/admin"
          element={<RoleRoute allowedRoles={["admin"]}><AdminLayout /></RoleRoute>}
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="sports" element={<SportsPage />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="assignments" element={<AssignmentsPage />} />
          <Route path="schedules" element={<SchedulesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
