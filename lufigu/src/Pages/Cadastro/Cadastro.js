import React, { useContext, useState } from 'react';
import '../Cadastro/Cadastro.css';
import { Back } from '../../components/Back/Back';
import logo from '../Cadastro/LUFIGU.png';
import { GrFormView as Olho } from "react-icons/gr";
import { GrFormViewHide as OlhoF } from "react-icons/gr";
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../AuthContext/AuthProvider';

const Cadastro = ({ name, email, password, confirmPassword, setName, setEmail, setPassword, setConfirmPassword }) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState(false);
  const [varia, setVaria] = useState(false);
  const [varia2, setVaria2] = useState(false);
  const { login } = useContext(AuthContext);


  const agoraCadastro = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setInputs(true);
    } else {
      setInputs(false);
      try {
        await axios.post('http://localhost:5000/cadastro', { name, email, password, confirmPassword });

        const result = await axios.post('http://localhost:5000/login-google', { email })
        const { token } = result.data
        localStorage.setItem('token', token);
        login(token)

        setName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        navigate('/')


      } catch (error) {
        console.error('Erro ao cadastrar:', error);
      }
    }
  };

  const responseGoogle = async (response) => {
    try {
      const decoded = jwtDecode(response.credential);
      const { name, email } = decoded;

      await axios.post('http://localhost:5000/cadastro', { name, email, isGoogleUser: true });

      const result = await axios.post('http://localhost:5000/login-google', { email })
      const { token } = result.data
      localStorage.setItem('token', token);
      login(token)
      navigate('/')

    } catch (error) {
      console.error('Erro ao fazer cadastro com o Google:', error);
    }
  };

  const closeInputs = () => {
    setInputs(false);
  };

  const ver = () => {
    setVaria(prevState => !prevState);
  };

  const ver2 = () => {
    setVaria2(prevState => !prevState);
  };


  

  return (
    <div className='booCadastro' >
      <Back tamanho={40} color={'white'} top={5} left={3} caminho={' '} />

      <div className='booImg'>
        <img alt='logo' src={logo} width={100} height={100} />
        <h2 style={{ color: 'white' }}>Cadastre-se</h2>
      </div>

      <div className='boxII'>
        <div className='centerww'>
          <label>Nome:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='input8'
          />
        </div>

        <div className='centerww'>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='input8'
          />
        </div>

        <div className='centerww'>
          <label>Senha:</label>
          <input
            type={varia ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='input8'
          />
          <button onClick={ver} id='olho'>{varia ? <Olho style={{ fontSize: '25px' }} /> : <OlhoF style={{ fontSize: '25px' }} />}</button>
        </div>

        <div className='centerww'>
          <label>Confirmar Senha:</label>
          <input
            type={varia2 ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className='input8'
          />
          <button onClick={ver2} id='olho'>{varia2 ? <Olho style={{ fontSize: '25px' }} /> : <OlhoF style={{ fontSize: '25px' }} />}</button>
        </div>
      </div>

      <h5>Já possui uma conta? <Link to={'/login'}>Login</Link></h5>

      <button type="submit" onClick={agoraCadastro} id='btn12'>Cadastrar</button>

      <div className='divGoogle'>
        <GoogleLogin
          onSuccess={responseGoogle}
          onError={(error) => {
            console.error('Erro ao fazer cadastro com Google:', error);
          }}
        />
      </div>

      {inputs && (
        <div className='modal'>
          <div className='modal-content'>
            <p>🚨 Por favor insira os dados necessários! 🚨</p>
            <button onClick={closeInputs} id='btn' style={{ marginTop: '20px' }}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cadastro;
