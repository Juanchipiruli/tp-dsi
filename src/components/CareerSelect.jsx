import React, { useState } from 'react';
import '../styles/LocationSelect.css'; // Podemos reutilizar los mismos estilos
import carreras from '../data/carreras.json';

const CareerSelect = ({ value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCareers = carreras.carreras.filter(carrera =>
    carrera.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="location-select-container">
      <label htmlFor="career-search">Carrera:</label>
      <input
        type="text"
        id="career-search"
        placeholder="Buscar carrera..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="location-search"
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="location-select"
      >
        <option value="">Seleccione una carrera</option>
        {filteredCareers.map((carrera) => (
          <option key={carrera.nombre} value={carrera.nombre}>
            {carrera.nombre}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CareerSelect;