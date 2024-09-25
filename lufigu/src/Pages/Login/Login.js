import React, { useState, useContext } from 'react';
import axios from 'axios';
import '../Login/Login.css';
import logo from '../Cadastro/LUFIGU.png';
import { AuthContext } from '../AuthContext/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';
import { GrFormView as Olho } from "react-icons/gr";
import { GrFormViewHide as OlhoF } from "react-icons/gr";
import { Back } from '../../components/Back/Back';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [varia, setVaria] = useState(false);
  const [inputs, setInputs] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setInputs(true);
    } else {
      setInputs(false);
      try {
        const response = await axios.post('http://localhost:5000/login', { email, password });
        const { token } = response.data;
        localStorage.setItem('token', token);
        login(token);

        setEmail('')
        setPassword('')

        navigate('/');
      } catch (error) {
        setError('Email ou senha inválidos.');
      }
    }
  };

  const responseGoogle = async (response) => {
    try {

      const decoded = jwtDecode(response.credential);
      const { email } = decoded;


      const result = await axios.post('http://localhost:5000/login-google', { email });


      const { token } = result.data;
      localStorage.setItem('token', token);
      login(token);
      navigate('/');
    } catch (error) {
      if (error.response.data.msg === 'Faça seu cadastro por favor') {
        setError('Usuario não encontrado, faça seu cadastro por favor')
      } else {
        setError('Erro ao fazer login com o Google. Tente novamente.');
      }
    }
  };

  const closeInputs = () => {
    setInputs(false);
  };

  const ver = () => {
    setVaria(prevState => !prevState);
  };

  return (
    <div className="booLogin" >
      <Back tamanho={40} color={'white'} top={5} left={3} caminho={' '} />

      <div className='booImg'>
        <img alt='logo' src={logo} width={100} height={100} />
        <h2 style={{ color: 'white' }}>Bem vindo de volta!</h2>
      </div>

      <div className='boxII'>
        <div className="centerww">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            className='input8'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="centerww">
          <label htmlFor="password">Senha:</label>
          <input
            type={varia ? 'text' : 'password'}
            className='input8'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button onClick={ver} id='olho'>{varia ? <Olho style={{ fontSize: '25px' }} /> : <OlhoF style={{ fontSize: '25px' }} />}</button>
        </div>
      </div>
      {error && <p className="error">{error}</p>}

      <h5>Ainda não possui uma conta? <Link to={'/cadastro'}>Cadastre-se</Link></h5>

      <button type="submit" onClick={handleSubmit} id='btn12'>Entrar</button>

      <div className='divGoogle'>
        <GoogleLogin
          onSuccess={responseGoogle}
          onFailure={(error) => {
            console.error('Erro ao fazer login com Google:', error);
            setError('Erro ao fazer login com o Google. Tente novamente.');
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

export default Login;
