import React from 'react';
import '../Busca/Busca.css';

export const Busca = ({ onSearchChange }) => {
  return (
    <input 
      placeholder='O que você está procurando?' 
      className='input' 
      onChange={onSearchChange}
    />
  );
};
