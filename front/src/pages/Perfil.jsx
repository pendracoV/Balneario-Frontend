// src/pages/Perfil.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../component/common/LoadingSpinner';

const Perfil = () => {
  const { user, authenticatedRequest, setError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    documento: '',
    email: '',
    telefono: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        documento: user.documento || '',
        email: user.email || '',
        telefono: user.telefono || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.documento.trim()) {
      newErrors.documento = 'El documento es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess('');

      const response = await authenticatedRequest(`/api/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar perfil');
      }

      setSuccess('Perfil actualizado exitosamente');
      setEditMode(false);
      
      // Aquí deberías actualizar el usuario en el contexto
      // Por ahora solo mostramos el mensaje de éxito
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: user.nombre || '',
      documento: user.documento || '',
      email: user.email || '',
      telefono: user.telefono || ''
    });
    setEditMode(false);
    setErrors({});
    setSuccess('');
  };

  if (!user) {
    return <LoadingSpinner text="Cargando perfil..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-card p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.nombre?.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">{user.nombre}</h1>
                  <p className="text-gray-600 capitalize">{user.rol}</p>
                </div>
              </div>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Editar Perfil
                </button>
              )}
            </div>
          </div>

          {/* Formulario de perfil */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Información Personal
            </h2>

            {success && (
              <div className="mb-4 bg-success-50 border border-success-200 text-success-800 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                      !editMode ? 'bg-gray-50 text-gray-600' : ''
                    } ${errors.nombre ? 'border-error-500' : 'border-gray-300'}`}
                  />
                  {errors.nombre && (
                    <p className="mt-1 text-sm text-error-600">{errors.nombre}</p>
                  )}
                </div>

                {/* Documento */}
                <div>
                  <label htmlFor="documento" className="block text-sm font-medium text-gray-700 mb-2">
                    Documento de identidad
                  </label>
                  <input
                    type="text"
                    id="documento"
                    name="documento"
                    value={formData.documento}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                      !editMode ? 'bg-gray-50 text-gray-600' : ''
                    } ${errors.documento ? 'border-error-500' : 'border-gray-300'}`}
                  />
                  {errors.documento && (
                    <p className="mt-1 text-sm text-error-600">{errors.documento}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                      !editMode ? 'bg-gray-50 text-gray-600' : ''
                    } ${errors.email ? 'border-error-500' : 'border-gray-300'}`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-error-600">{errors.email}</p>
                  )}
                </div>

                {/* Teléfono */}
                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                      !editMode ? 'bg-gray-50 text-gray-600' : ''
                    } ${errors.telefono ? 'border-error-500' : 'border-gray-300'}`}
                  />
                  {errors.telefono && (
                    <p className="mt-1 text-sm text-error-600">{errors.telefono}</p>
                  )}
                </div>
              </div>

              {/* Botones de acción */}
              {editMode && (
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Cambiar contraseña */}
          <div className="bg-white rounded-lg shadow-card p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Seguridad
            </h2>
            <div className="border-t pt-4">
              <button className="text-primary-600 hover:text-primary-700 font-medium">
                Cambiar contraseña
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;