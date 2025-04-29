import React, { useState } from 'react';
import '../styles/LocationSelect.css';

const locations = [
  'San Francisco',
  'Córdoba Capital',
  'Frontera',
  'Josefina',
  'Plaza San Francisco',
  'Devoto',
  'Freyre',
  'Porteña',
  'Brinkmann',
  'Morteros'
];

const LocationSelect = ({ value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredLocations = locations.filter(location =>
    location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="location-select-container">
      <label htmlFor="location-search">Localidad:</label>
      <input
        type="text"
        id="location-search"
        placeholder="Buscar localidad..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="location-search"
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="location-select"
      >
        <option value="">Seleccione una localidad</option>
        {filteredLocations.map((location) => (
          <option key={location} value={location}>
            {location}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationSelect;