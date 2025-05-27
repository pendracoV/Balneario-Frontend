import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const Header = () => {
  const { user, isAuthenticated, isAdmin, isPersonal, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-bold text-xl">BS</span>
            </div>
            <span className="text-xl font-heading font-bold">Balneario San Andrés</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-primary-200 transition-colors">Inicio</Link>
            
            {isAuthenticated() ? (
              <>
                <Link to="/dashboard" className="hover:text-primary-200 transition-colors">Dashboard</Link>
                <Link to="/reservas" className="hover:text-primary-200 transition-colors">Reservas</Link>
                
                {isAdmin() && (
                  <Link to="/admin" className="hover:text-primary-200 transition-colors">Administración</Link>
                )}
                
                {(isPersonal() || isAdmin()) && (
                  <Link to="/personal" className="hover:text-primary-200 transition-colors">Personal</Link>
                )}
                
                <div className="relative">
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 hover:text-primary-200 transition-colors"
                  >
                    <span>{user?.nombre}</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link 
                        to="/perfil" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Mi Perfil
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-primary-200 transition-colors">Iniciar Sesión</Link>
                <Link 
                  to="/register" 
                  className="bg-secondary-500 hover:bg-secondary-600 px-4 py-2 rounded-md transition-colors"
                >
                  Registrarse
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-500">
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="hover:text-primary-200 transition-colors py-2">Inicio</Link>
              
              {isAuthenticated() ? (
                <>
                  <Link to="/dashboard" className="hover:text-primary-200 transition-colors py-2">Dashboard</Link>
                  <Link to="/reservas" className="hover:text-primary-200 transition-colors py-2">Reservas</Link>
                  <Link to="/perfil" className="hover:text-primary-200 transition-colors py-2">Mi Perfil</Link>
                  
                  {isAdmin() && (
                    <Link to="/admin" className="hover:text-primary-200 transition-colors py-2">Administración</Link>
                  )}
                  
                  {(isPersonal() || isAdmin()) && (
                    <Link to="/personal" className="hover:text-primary-200 transition-colors py-2">Personal</Link>
                  )}
                  
                  <button 
                    onClick={handleLogout}
                    className="text-left hover:text-primary-200 transition-colors py-2"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-primary-200 transition-colors py-2">Iniciar Sesión</Link>
                  <Link to="/register" className="hover:text-primary-200 transition-colors py-2">Registrarse</Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;