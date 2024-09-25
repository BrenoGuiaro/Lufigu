import React, { useContext, useState } from 'react';
import { Produtos } from '../Produtos/Produtos';
import { NavBar } from '../../components/NavBar/NavBar';
import { IconSobre } from '../../components/IconSobre/IconSobre';
import { FaBoxesStacked as IconAdm } from "react-icons/fa6";
import '../Home/Home.css'
import { AuthContext } from '../AuthContext/AuthProvider';
import { Link } from 'react-router-dom';

export const Home = ({ produtosHome }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useContext(AuthContext);

  console.log('teste', user)

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = produtosHome.filter((product) => {
    const matched = product.variacoes.some((variacao) =>
      variacao.nome.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    return matched;
  });

  return (
    <>
      <NavBar onSearchChange={handleSearchChange} />
      <Produtos produtosHome={filteredProducts} />
      <div className='divSobre'>
        <IconSobre />
      </div>

      {user && user.role === 'admin' && (
        <Link to={'/admin'} className='boxSobre2'><IconAdm style={{ color: 'white', fontSize: '25px' }} /></Link>
      )}
    </>
  );
};
