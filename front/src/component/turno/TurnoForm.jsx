// src/components/turno/TurnoForm.jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { API_BASE_URL, USER_ROLES } from '../../utils/constants'

const TurnoForm = () => {
  const { authenticatedRequest } = useAuth()
  const [staff, setStaff]           = useState([])
  const [personalId, setPersonalId] = useState('')
  const [fecha, setFecha]           = useState('')
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)
  const [success, setSuccess]       = useState(null)

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res  = await authenticatedRequest(`${API_BASE_URL}/api/users`)
        if (!res.ok) throw new Error('No se pudo cargar el personal')
        const data = await res.json()
        const onlyPersonal = data.filter(u =>
          u.role === USER_ROLES.PERSONAL ||
          u.Roles?.some(r => r.name === USER_ROLES.PERSONAL)
        )
        setStaff(onlyPersonal)
      } catch (err) {
        console.error(err)
        setError('Error cargando personal')
      }
    }
    fetchStaff()
  }, [authenticatedRequest])

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!personalId || !fecha) {
      setError('Debes seleccionar personal y fecha')
      return
    }

    setLoading(true)
    try {
      const res = await authenticatedRequest(
        `${API_BASE_URL}/api/turnos/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ personalId, fecha })
        }
      )

      const text = await res.text()
      console.log('RESPUESTA SERVIDOR:', res.status, text)
      let json
      try { json = JSON.parse(text) } catch {}
      if (!res.ok) {
        throw new Error(json?.message || text || 'Error creando turnos')
      }

      const createdTurnos = json
      setSuccess(`Se crearon ${createdTurnos.length} turnos para ${fecha}`)
      setPersonalId('')
      setFecha('')
    } catch (err) {
      console.error('Error en creación de turnos:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Crear Turnos</h2>
      {error   && <p className="mb-4 text-red-600">{error}</p>}
      {success && <p className="mb-4 text-green-600">{success}</p>}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Seleccionar Personal
        </label>
        <select
          value={personalId}
          onChange={e => setPersonalId(e.target.value)}
          className="w-full border-gray-300 rounded px-3 py-2"
          required
        >
          <option value="">-- Elige un colaborador --</option>
          {staff.map(p => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Seleccionar Fecha
        </label>
        <input
          type="date"
          value={fecha}
          onChange={e => setFecha(e.target.value)}
          className="w-full border-gray-300 rounded px-3 py-2"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 rounded text-white ${
          loading ? 'bg-gray-400' : 'bg-primary-600 hover:bg-primary-700'
        } transition-colors`}
      >
        {loading ? 'Creando...' : 'Crear Turnos'}
      </button>
    </form>
)
}

export default TurnoForm
