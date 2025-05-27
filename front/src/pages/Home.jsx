// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 animate-fade-in">
            Balneario San Andrés
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-slide-up">
            Disfruta de un ambiente familiar con las mejores instalaciones, 
            piscinas cristalinas y servicios de primera calidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            {isAuthenticated() ? (
              <>
                <Link
                  to="/reservas"
                  className="bg-secondary-500 hover:bg-secondary-600 px-8 py-3 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
                >
                  Hacer Reserva
                </Link>
                <Link
                  to="/dashboard"
                  className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
                >
                  Mi Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-secondary-500 hover:bg-secondary-600 px-8 py-3 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
                >
                  Registrarse
                </Link>
                <Link
                  to="/login"
                  className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
                >
                  Iniciar Sesión
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Servicios Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ofrecemos una experiencia completa para toda la familia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Piscinas */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-xl shadow-card hover:shadow-card-hover transition-all">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Piscinas</h3>
              <p className="text-gray-600">
                Piscinas para adultos y niños con agua cristalina y áreas de descanso.
              </p>
            </div>

            {/* Servicio de Cocina */}
            <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-8 rounded-xl shadow-card hover:shadow-card-hover transition-all">
              <div className="w-16 h-16 bg-secondary-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Servicio de Cocina</h3>
              <p className="text-gray-600">
                Cocina completamente equipada disponible por $25.000 adicionales.
              </p>
            </div>

            {/* Habitaciones */}
            <div className="bg-gradient-to-br from-success-50 to-success-100 p-8 rounded-xl shadow-card hover:shadow-card-hover transition-all">
              <div className="w-16 h-16 bg-success-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Habitaciones</h3>
              <p className="text-gray-600">
                Cómodas habitaciones privadas disponibles por $50.000 por noche.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Horarios y Precios */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
              Horarios y Precios
            </h2>
            <p className="text-xl text-gray-600">
              Encuentra la opción que mejor se adapte a tus necesidades
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Entradas Generales */}
            <div className="bg-white p-8 rounded-xl shadow-card">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                Entradas Generales
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-primary-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900">Horario Diurno</h4>
                    <p className="text-gray-600">9:00 AM - 12:00 PM | 2:00 PM - 6:00 PM</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-primary-600">$5.000</span>
                    <p className="text-sm text-gray-500">por persona</p>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-secondary-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900">Horario Nocturno</h4>
                    <p className="text-gray-600">6:00 PM - 11:00 PM</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-secondary-600">$10.000</span>
                    <p className="text-sm text-gray-500">por persona</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reservas Privadas */}
            <div className="bg-white p-8 rounded-xl shadow-card">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                Reservas Privadas
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-success-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900">Entre Semana</h4>
                    <p className="text-gray-600">Mínimo 10 personas</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-success-600">$20.000</span>
                    <p className="text-sm text-gray-500">por persona</p>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-warning-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900">Fin de Semana</h4>
                    <p className="text-gray-600">Mínimo 15 personas</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-warning-600">$25.000</span>
                    <p className="text-sm text-gray-500">por persona</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Nota:</strong> Si no se alcanza el mínimo de personas, se aplica un cargo adicional de $100.000
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-heading font-bold mb-4">
            ¿Listo para disfrutar?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Haz tu reserva ahora y asegura tu lugar en el mejor balneario de la región
          </p>
          
          {isAuthenticated() ? (
            <Link
              to="/reservas"
              className="bg-secondary-500 hover:bg-secondary-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 inline-block"
            >
              Hacer Reserva Ahora
            </Link>
          ) : (
            <Link
              to="/register"
              className="bg-secondary-500 hover:bg-secondary-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 inline-block"
            >
              Registrarse para Reservar
            </Link>
          )}
        </div>
      </section>

      {/* Información de Contacto */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
              Información de Contacto
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ubicación</h3>
              <p className="text-gray-600">
                Carrera Principal<br />
                Municipio, Huila<br />
                Colombia
              </p>
            </div>

            <div>
              <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Teléfono</h3>
              <p className="text-gray-600">
                +57 123 456 7890<br />
                +57 098 765 4321
              </p>
            </div>

            <div>
              <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">
                info@balneario-sanandres.com<br />
                reservas@balneario-sanandres.com
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;