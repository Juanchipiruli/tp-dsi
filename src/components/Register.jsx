import { useState } from 'react'
import localidades from '../data/localidades.json'
import users from '../data/users.json'
import '../styles/Register.css'

function Register() {
  const [formData, setFormData] = useState({
    legajo: '',
    nombre: '',
    dni: '',
    carrera: '',
    localidad: '',
    password: ''
  })
  const [searchLocalidad, setSearchLocalidad] = useState('')
  const [error, setError] = useState('')

  const filteredLocalidades = localidades.localidades.filter(loc =>
    loc.toLowerCase().includes(searchLocalidad.toLowerCase())
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (Object.values(formData).every(value => value)) {
      // Verificar si el legajo ya existe
      const userExists = users.users.some(user => user.legajo === formData.legajo)
      
      if (userExists) {
        setError('El legajo ya está registrado')
        return
      }

      // Agregar el nuevo usuario al array de usuarios
      users.users.push(formData)
      
      // En un caso real, aquí se enviarían los datos al backend
      // Por ahora solo simulamos que se guardó
      setError('')
      alert('Registro exitoso')
      window.location.href = '/' // Redirigir al login
    } else {
      setError('Por favor complete todos los campos')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleGoBack = () => {
    window.location.href = '/';
  };

  return (
    <div className="register-container">
      <button onClick={handleGoBack} className="close-button">
        ×
      </button>
      <h2>Registro de Usuario - Sistema de Pasantías</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="legajo">Legajo:</label>
          <input
            type="text"
            id="legajo"
            name="legajo"
            value={formData.legajo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="nombre">Nombre Completo:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="dni">DNI:</label>
          <input
            type="text"
            id="dni"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="carrera">Carrera:</label>
          <input
            type="text"
            id="carrera"
            name="carrera"
            value={formData.carrera}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="localidad">Localidad:</label>
          <input
            type="text"
            placeholder="Buscar localidad..."
            value={searchLocalidad}
            onChange={(e) => setSearchLocalidad(e.target.value)}
          />
          <select
            id="localidad"
            name="localidad"
            value={formData.localidad}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una localidad</option>
            {filteredLocalidades.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="register-button">
          Registrarse
        </button>
      </form>
    </div>
  )
}

export default Register