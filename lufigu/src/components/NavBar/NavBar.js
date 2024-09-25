import React, { useContext, useEffect, useState, } from 'react';
import '../NavBar/NavBar.css';
import logo from '../NavBar/LUFIGU.png';
import { Busca } from '../Busca/Busca';
import { FaCartShopping as Cart } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { useCart } from '../../Pages/CartContext/CartContext';
import { AuthContext } from '../../Pages/AuthContext/AuthProvider';
import { FaUserCircle as UserIcon } from "react-icons/fa";
import { IoExitOutline as Exit } from "react-icons/io5";


export const NavBar = ({ onSearchChange }) => {
  const { totalItems } = useCart();
  const { user, logout } = useContext(AuthContext);

  const [perfil, setPerfil] = useState(false)
  const [mobile, setMobile] = useState(false);

  const handlePerfil = () => {
    setPerfil(!perfil);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 420) {
        setMobile(true);


      } else {
        setMobile(false);

      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [])








  return (
    <>
      <div className='box'>
        <img src={logo} className='logo' alt='' />
        <div className='input1'>
          <Busca onSearchChange={onSearchChange} />
        </div>

        <div className='pao2'>

          {user ? (
            <>
              <div className="profile-container" onClick={handlePerfil}>
                <UserIcon id='userN' />
                <h5 id='msg'>Bem-vindo, {user.name || 'Usuário'}</h5>
                <Link onClick={logout}><Exit id='exit' /></Link>
              </div>











            </>
          ) : (
            <>

              <Link to={'/cadastro'}>
                <div className="profile-container" >
                  <UserIcon id='userN' />
                  <h5 id='msg'>Crie sua Conta !</h5>
                </div>


              </Link>


            </>
          )}





          <Link to="/cart">
            <div className='cart-container'>
              <Cart id='iconCart' />
              <span className='cart-count2'>{totalItems}</span>
            </div>
          </Link>

          {perfil && mobile && (
            <div onClick={handlePerfil} className='exit-button'>
              <UserIcon id='userN' style={{ fontSize: '150px' }} />
              <button id='sairM' onClick={logout}>Sair da conta</button>
            </div>

          )}




        </div>



      </div>
      <div className='boxMobile'>
        <Busca onSearchChange={onSearchChange} />
      </div>
    </>
  );
};
