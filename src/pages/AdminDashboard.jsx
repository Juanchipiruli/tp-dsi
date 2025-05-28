import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth, logout } from '../services/authService';
import '../styles/AdminDashboard.css';
import localidades from '../data/localidades.json';
import CareerSelect from '../components/CareerSelect';
const API_URL = 'https://backenddsi.onrender.com';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminInfo, setAdminInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('students');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    legajo: '',
    nombre_pila: '',
    apellido: '',
    dni: '',
    carrera: '',
    localidad: '',
    password: ''
  });
  const [searchLocalidad, setSearchLocalidad] = useState('');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();


  // Filtrar localidades basado en la búsqueda
  const filteredLocalidades = localidades.localidades.filter(loc =>
    loc.toLowerCase().includes(searchLocalidad.toLowerCase())
  );

  // Obtener información del administrador desde sessionStorage
  useEffect(() => {
    const admin = JSON.parse(sessionStorage.getItem('currentUser'));
    setAdminInfo(admin);
    
    // Cargar la lista de estudiantes al iniciar
    fetchStudents();
  }, []);

  // Función para obtener la lista de estudiantes
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/users`);
      
      if (!response.ok) {
        throw new Error('Error al obtener la lista de estudiantes');
      }
      
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar los datos. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar un estudiante
  const deleteStudent = async (legajo) => {
    if (!confirm('¿Está seguro que desea eliminar este estudiante?')) {
      return;
    }
    
    try {
      const response = await fetchWithAuth(`${API_URL}/admin/users/delete/${legajo}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar el estudiante');
      }
      
      // Actualizar la lista de estudiantes
      setStudents(students.filter(student => student.legajo !== legajo));
      alert('Estudiante eliminado correctamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el estudiante');
    }
  };

  // Función para manejar cambios en el formulario
  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Función para agregar un nuevo estudiante
  const addStudent = async (e) => {
    e.preventDefault();
    
    // Validar que todos los campos estén completos
    if (Object.values(formData).some(value => value.trim() === '')) {
      setFormError('Todos los campos son obligatorios');
      return;
    }
    
    // Validar formato de legajo (4-6 dígitos)
    if (!/^\d{4,6}$/.test(formData.legajo)) {
      setFormError('El legajo debe tener entre 4 y 6 dígitos');
      return;
    }
    
    // Validar contraseña (mínimo 6 caracteres)
    if (formData.password.length < 6) {
      setFormError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setFormLoading(true);
    setFormError('');
    
    try {
      // Verificar si el legajo ya existe
      const existingStudent = students.find(student => student.legajo === formData.legajo);
      if (existingStudent) {
        setFormError('El legajo ya está registrado');
        setFormLoading(false);
        return;
      }
      
      // Crear objeto con los datos del estudiante en el formato esperado por la API
      const studentData = {
        legajo: formData.legajo,
        nombre_pila: formData.nombre_pila,
        apellido: formData.apellido,
        dni: formData.dni,
        carrera: formData.carrera,
        localidad: formData.localidad,
        password: formData.password,
        role: 'student' // Asegurarse de que se asigne el rol correcto
      };
      
      console.log('Enviando datos:', studentData);
      
      // Enviar datos al servidor
      const response = await fetchWithAuth(`${API_URL}/admin/users/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error del servidor:', errorData);
        throw new Error(errorData.error || 'Error al registrar el estudiante');
      }
      
      // Obtener el nuevo estudiante creado
      const newStudent = await response.json();
      
      // Actualizar la lista de estudiantes
      setStudents([...students, newStudent]);
      
      // Limpiar el formulario y cerrarlo
      setFormData({
        legajo: '',
        nombre_pila: '',
        apellido: '',
        dni: '',
        carrera: '',
        localidad: '',
        password: ''
      });
      setShowAddForm(false);
      
      alert('Estudiante registrado correctamente');
    } catch (error) {
      console.error('Error:', error);
      setFormError('Error al registrar el estudiante. Por favor, intente nuevamente.');
    } finally {
      setFormLoading(false);
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Panel de Administración - Sistema de Pasantías</h1>
        <div className="admin-info">
          {adminInfo && (
            <span>Bienvenido, {adminInfo.username}</span>
          )}
          <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={`nav-button ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          Estudiantes
        </button>
        <button 
          className={`nav-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Estadísticas
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'students' && (
          <div className="students-section">
            <div className="section-header">
              <h2>Gestión de Estudiantes</h2>
              <button 
                className="add-button"
                onClick={() => setShowAddForm(true)}
              >
                Agregar Alumno
              </button>
            </div>
            
            {loading ? (
              <p className="loading-message">Cargando estudiantes...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : (
              <div className="students-table-container">
                <table className="students-table">
                  <thead>
                    <tr>
                      <th>Legajo</th>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>DNI</th>
                      <th>Carrera</th>
                      <th>Localidad</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length > 0 ? (
                      students.map(student => (
                        <tr key={student.id}>
                          <td>{student.legajo}</td>
                          <td>{student.nombre_pila || (student.nombre ? student.nombre.split(' ')[0] : '')}</td>
                          <td>{student.apellido || (student.nombre ? student.nombre.split(' ').slice(1).join(' ') : '')}</td>
                          <td>{student.dni}</td>
                          <td>{student.carrera}</td>
                          <td>{student.localidad}</td>
                          <td className="action-buttons">
                            <button 
                              className="edit-button"
                              onClick={() => alert(`Editar estudiante ${student.id} (Funcionalidad en desarrollo)`)}
                            >
                              Editar
                            </button>
                            <button 
                              className="delete-button"
                              onClick={() => deleteStudent(student.legajo)}
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="no-data">No hay estudiantes registrados</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="stats-section">
            <h2>Estadísticas del Sistema</h2>
            <p>Total de estudiantes registrados: {students.length}</p>
            {/* Aquí puedes agregar más estadísticas según necesites */}
          </div>
        )}
      </main>

      {/* Modal para agregar estudiante */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="close-modal-button"
              onClick={() => setShowAddForm(false)}
            >
              ×
            </button>
            <h2>Agregar Nuevo Alumno</h2>
            <form onSubmit={addStudent} className="add-student-form">
              <div className="form-group">
                <label htmlFor="legajo">Legajo:</label>
                <input
                  type="text"
                  id="legajo"
                  name="legajo"
                  value={formData.legajo}
                  onChange={handleFormChange}
                  pattern="\d{4,6}"
                  title="El legajo debe tener entre 4 y 6 dígitos"
                  required
                  disabled={formLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="nombre_pila">Nombre:</label>
                <input
                  type="text"
                  id="nombre_pila"
                  name="nombre_pila"
                  value={formData.nombre_pila}
                  onChange={handleFormChange}
                  required
                  disabled={formLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="apellido">Apellido:</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleFormChange}
                  required
                  disabled={formLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="dni">DNI:</label>
                <input
                  type="text"
                  id="dni"
                  name="dni"
                  value={formData.dni}
                  onChange={handleFormChange}
                  required
                  disabled={formLoading}
                />
              </div>
              <div className="form-group">
                <CareerSelect 
                  value={formData.carrera}
                  onChange={(value) => setFormData({...formData, carrera: value})}
                />
              </div>
              <div className="form-group">
                <label htmlFor="localidad">Localidad:</label>
                <input
                  type="text"
                  placeholder="Buscar localidad..."
                  value={searchLocalidad}
                  onChange={(e) => setSearchLocalidad(e.target.value)}
                  disabled={formLoading}
                />
                <select
                  id="localidad"
                  name="localidad"
                  value={formData.localidad}
                  onChange={handleFormChange}
                  required
                  disabled={formLoading}
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
                  onChange={handleFormChange}
                  minLength={6}
                  required
                  disabled={formLoading}
                />
              </div>
              {formError && <div className="error-message">{formError}</div>}
              <div className="form-buttons">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowAddForm(false)}
                  disabled={formLoading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={formLoading}
                >
                  {formLoading ? 'Procesando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;