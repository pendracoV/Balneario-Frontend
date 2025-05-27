// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NotFound = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Ilustración */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-16 h-16 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.220 0-4.239.86-5.73 2.291M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h1 className="text-6xl font-bold text-primary-600 mb-2">404</h1>
        </div>

        {/* Mensaje */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Oops! Página no encontrada
          </h2>
          <p className="text-gray-600">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
        </div>

        {/* Botones de acción */}
        <div className="space-y-4">
          <Link
            to="/"
            className="block w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Volver al inicio
          </Link>

          {isAuthenticated() && (
            <Link
              to="/dashboard"
              className="block w-full bg-white hover:bg-gray-50 text-primary-600 border-2 border-primary-600 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Ir a mi dashboard
            </Link>
          )}

          <button
            onClick={() => window.history.back()}
            className="block w-full text-gray-600 hover:text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            ← Volver atrás
          </button>
        </div>

        {/* Enlaces útiles */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Enlaces útiles:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/" className="text-primary-600 hover:text-primary-700">
              Inicio
            </Link>
            {isAuthenticated() ? (
              <>
                <Link to="/reservas" className="text-primary-600 hover:text-primary-700">
                  Reservas
                </Link>
                <Link to="/perfil" className="text-primary-600 hover:text-primary-700">
                  Perfil
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-primary-600 hover:text-primary-700">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="text-primary-600 hover:text-primary-700">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;