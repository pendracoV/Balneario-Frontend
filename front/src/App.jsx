// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ReservasProvider } from './context/ReservasContext';

// Páginas principales
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Reservas from './pages/Reservas';
import Perfil from './pages/Perfil';
import NotFound from './pages/NotFound';

// Páginas de Admin
//import AdminHome from './pages/Admin/AdminHome';
//import Usuarios from './pages/Admin/Usuarios';
//import ReservasAdmin from './pages/Admin/ReservasAdmin';
//import Inventario from './pages/Admin/Inventario';

// Páginas de Personal
//import PersonalHome from './pages/Personal/PersonalHome';
//import VerReservasPersonal from './pages/Personal/VerReservasPersonal';

// Componentes de protección de rutas
import ProtectedRoute from './component/common/ProtectedRoute';
import { AdminRoute } from './component/common/AdminRoute';
import { PersonalRoute } from './component/common/PersonalRoute';

// Layout principal
import Layout from './component/common/Layout';

// Estilos
import './index.css';

function App() {
  return (
    <AuthProvider>
      <ReservasProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Rutas protegidas - Clientes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Layout><Dashboard /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reservas" 
                element={
                  <ProtectedRoute>
                    <Layout><Reservas /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/perfil" 
                element={
                  <ProtectedRoute>
                    <Layout><Perfil /></Layout>
                  </ProtectedRoute>
                } 
              />

              {/* Rutas de Administrador */}
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <Layout></Layout>
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/usuarios" 
                element={
                  <AdminRoute>
                    <Layout></Layout>
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/reservas" 
                element={
                  <AdminRoute>
                    <Layout></Layout>
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/inventario" 
                element={
                  <AdminRoute>
                    <Layout></Layout>
                  </AdminRoute>
                } 
              />

              {/* Rutas de Personal */}
              <Route 
                path="/personal" 
                element={
                  <PersonalRoute>
                    <Layout></Layout>
                  </PersonalRoute>
                } 
              />
              <Route 
                path="/personal/reservas" 
                element={
                  <PersonalRoute>
                    <Layout></Layout>
                  </PersonalRoute>
                } 
              />

              {/* Ruta 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </ReservasProvider>
    </AuthProvider>
  );
}

export default App;