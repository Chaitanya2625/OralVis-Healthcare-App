import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import TechnicianDashboard from './pages/TechnicianDashboard.jsx';
import DentistDashboard from './pages/DentistDashboard.jsx';
import { auth } from './services/auth';

function Protected({ role, children }) {
  if (!auth.loggedIn()) return <Navigate to="/login" replace />;
  if (role && !auth.is(role)) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const navigate = useNavigate();
  const logout = () => { auth.clear(); navigate('/login'); };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <header className="flex items-center justify-between mb-6">
        <Link to="/" className="text-2xl font-semibold">OralVis</Link>
        <nav className="flex items-center gap-3">
          {auth.is('technician') && <Link to="/tech" className="underline">Technician</Link>}
          {auth.is('dentist') && <Link to="/dentist" className="underline">Dentist</Link>}
          {auth.loggedIn()
            ? <button onClick={logout} className="btn">Logout</button>
            : <Link to="/login" className="btn btn-primary">Login</Link>}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={
          auth.is('technician') ? <Navigate to="/tech"/> :
          auth.is('dentist') ? <Navigate to="/dentist"/> :
          <Navigate to="/login"/>
        }/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/tech" element={<Protected role="technician"><TechnicianDashboard/></Protected>}/>
        <Route path="/dentist" element={<Protected role="dentist"><DentistDashboard/></Protected>}/>
        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
    </div>
  );
}
