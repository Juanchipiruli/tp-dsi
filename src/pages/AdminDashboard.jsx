import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth, logout, getAuthToken } from '../services/authService';
import '../styles/AdminDashboard.css';
import localidades from '../data/localidades.json';
import CareerSelect from '../components/CareerSelect';
import LocationSelect from '../components/LocationSelect';
import { capitalize } from 'lodash';
const API_URL = 'http://localhost:3000';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminInfo, setAdminInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('students');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    legajo: '',
    nombre: '',
    apellido: '',
    email: '',
    carrera: '',
    localidad: '',
    password: ''
  });
  const [searchLocalidad, setSearchLocalidad] = useState('');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: '',
    legajo: '',
    nombre: '',
    apellido: '',
    email: '',
    carrera: '',
    localidad: '',
    password: ''
  });
  const [editFormError, setEditFormError] = useState('');
  const [editFormLoading, setEditFormLoading] = useState(false);
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
      const response = await fetchWithAuth(`${API_URL}/api/users`, {
        
      });
      
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

  // Función para manejar cambios en el formulario
  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Función para eliminar un estudiante
  const deleteStudent = async (studentToDelete) => {
    if (!confirm('¿Está seguro que desea eliminar este estudiante?')) {
      return;
    }
    
    try {
      const response = await fetchWithAuth(`${API_URL}/api/users/${studentToDelete.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar el estudiante');
      }
      
      // Actualizar la lista de estudiantes
      setStudents(students.filter(s => s.id !== studentToDelete.id));
      alert('Estudiante eliminado correctamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el estudiante');
    }
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
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        carrera: formData.carrera,
        localidad: formData.localidad,
        password: formData.password,
      };
      
      console.log('Enviando datos:', studentData);
      
      // Enviar datos al servidor
      const response = await fetchWithAuth(`${API_URL}/api/users`, {
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
      const responseData = await response.json();
      const newStudent = responseData.user;
      
      // Actualizar la lista de estudiantes
      setStudents([...students, newStudent]);
      
      // Limpiar el formulario y cerrarlo
      setFormData({
        legajo: '',
        nombre: '',
        apellido: '',
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

  const openEditForm = (student) => {
    setEditFormData({ ...student, password: '' }); // No muestres la contraseña
    setEditFormError('');
    setShowEditForm(true);
  };

  const handleEditFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const saveEditedStudent = async (e) => {
    e.preventDefault();
    setEditFormLoading(true);
    setEditFormError('');
    try {
      // Validaciones aquí si quieres
      const response = await fetchWithAuth(`${API_URL}/api/users/${editFormData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al editar el estudiante');
      }
      // Actualiza la lista localmente o recarga desde el backend
      await fetchStudents();
      setShowEditForm(false);
    } catch (error) {
      setEditFormError(error.message || 'Error al editar el estudiante');
    } finally {
      setEditFormLoading(false);
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
                  <thead className="students-table-header">
                    <tr>
                      <th>Legajo</th>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>Carrera</th>
                      <th>Localidad</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length > 0 ? (
                      students.map(student => (
                        <tr key={student.legajo}>
                          <td>{student.legajo}</td>
                          <td>{capitalize(student.nombre)}</td>
                          <td>{capitalize(student.apellido)}</td>
                          <td>{student.carrera}</td>
                          <td>{student.localidad}</td>
                          <td className="action-buttons">
                            <button 
                              className="edit-button"
                              onClick={() => openEditForm(student)}
                            >
                              Editar
                            </button>
                            <button 
                              className="delete-button"
                              onClick={() => deleteStudent(student)}
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
                  type="number"
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
                <label htmlFor="nombre">Nombre:</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
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
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
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

      {showEditForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="close-modal-button"
              onClick={() => setShowEditForm(false)}
            >
              ×
            </button>
            <h2>Editar Alumno</h2>
            <form onSubmit={saveEditedStudent} className="edit-student-form">
              <div className="form-group">
                <label htmlFor="edit-legajo">Legajo:</label>
                <input
                  type="number"
                  id="edit-legajo"
                  name="legajo"
                  value={editFormData.legajo}
                  onChange={handleEditFormChange}
                  required
                  disabled={editFormLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-nombre">Nombre:</label>
                <input
                  type="text"
                  id="edit-nombre"
                  name="nombre"
                  value={editFormData.nombre}
                  onChange={handleEditFormChange}
                  required
                  disabled={editFormLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-apellido">Apellido:</label>
                <input
                  type="text"
                  id="edit-apellido"
                  name="apellido"
                  value={editFormData.apellido}
                  onChange={handleEditFormChange}
                  required
                  disabled={editFormLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-email">Email:</label>
                <input
                  type="email"
                  id="edit-email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditFormChange}
                  required
                  disabled={editFormLoading}
                />
              </div>
              <div className="form-group">
                <CareerSelect 
                  value={editFormData.carrera}
                  onChange={(value) => setEditFormData({...editFormData, carrera: value})}
                />
              </div>
              <div className="form-group">
                <LocationSelect
                  value={editFormData.localidad}
                  onChange={value => setEditFormData({ ...editFormData, localidad: value })}
                  disabled={editFormLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-password">Contraseña:</label>
                <input
                  type="password"
                  id="edit-password"
                  name="password"
                  value={editFormData.password}
                />
              </div>
              {editFormError && <div className="error-message">{editFormError}</div>}
              <div className="form-buttons">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowEditForm(false)}
                  disabled={editFormLoading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={editFormLoading}
                >
                  {editFormLoading ? 'Guardando...' : 'Guardar Cambios'}
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