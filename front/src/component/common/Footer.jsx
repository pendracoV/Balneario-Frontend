const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Balneario San Andrés</h3>
              <p className="text-gray-300">
                El mejor lugar para disfrutar en familia y amigos. 
                Piscinas, servicios de calidad y la mejor atención.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <div className="space-y-2 text-gray-300">
                <p>📍 Dirección del Balneario</p>
                <p>📞 +57 123 456 7890</p>
                <p>✉️ info@balneriosanandres.com</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Horarios</h3>
              <div className="space-y-2 text-gray-300">
                <p>🌅 Diurno: 9:00 AM - 6:00 PM</p>
                <p>🌙 Nocturno: 6:00 PM - 11:00 PM</p>
                <p>📅 Todos los días</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Balneario San Andrés. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;