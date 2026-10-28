import { Routes, Route, NavLink } from 'react-router-dom';
import { getUser } from './api.js';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Employees from './pages/Employees.jsx';
import Attendance from './pages/Attendance.jsx';
import Leaves from './pages/Leaves.jsx';

export default function App() {
  const user = getUser();

  // logged out: only the login page
  if (!user) return <Login />;

  const isAdmin = user.role === 'admin';
  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="layout">
      <aside>
        <h2>🏢 StaffSync</h2>
        <p className="who">{user.name} <span className="badge">{user.role}</span></p>
        <NavLink to="/" end>Dashboard</NavLink>
        {isAdmin && <NavLink to="/employees">Employees</NavLink>}
        <NavLink to="/attendance">Attendance</NavLink>
        <NavLink to="/leaves">Leaves</NavLink>
        <button className="logout" onClick={logout}>Logout</button>
      </aside>
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {isAdmin && <Route path="/employees" element={<Employees />} />}
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/leaves" element={<Leaves />} />
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </main>
    </div>
  );
}
