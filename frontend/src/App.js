import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Home } from './Pages/Home/Home';
import { UnicoProduto } from './Pages/Produto/UnicoProduto.js';
import { CartProvider } from './Pages/CartContext/CartContext.js';
import { Cart } from './components/Cart/Cart.js';
import { PagamentoPix } from './Pages/PagamentoPix/PagamentoPix.js';
import { Dinheiro } from './Pages/Dinheiro/Dinheiro.js';
import React, { useEffect, useState } from 'react';
import Login from './Pages/Login/Login.js';
import { AuthProvider } from './Pages/AuthContext/AuthProvider.js';
import ProtectedRoute from './Pages/RotaProtegida/ProtectedRoute.js';
import Cadastro from './Pages/Cadastro/Cadastro.js';
import { Admin } from './Pages/Admin/Admin.js';
import axios from 'axios';
import { Adicionar } from './components/Adicionar/Adicionar.js';
import { Atualizar } from './components/Atualizar/Atualizar.js';
import { AdicionarSabor } from './components/AdicionarSabor/AdicionarSabor.js';
import { Sobre } from './Pages/Sobre/Sobre.js';


function App() {

  const [produtosUnico, setProdutosUnico] = useState({});


  const getProdutos = async () => {
    try {
      const response = await axios.get('https://lufigu.onrender.com/produtos');
      const produtos = response.data.produtos.reduce((acc, produto) => {
        acc[produto._id] = produto;
        return acc;
      }, {});
      setProdutosUnico(produtos);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };


  //Cadastro de Usuario pelo front
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')


  const cadastro = async () => {
    try {
      // Determine se o usuário está se autenticando com o Google
      const isGoogleUser = false; // Defina como true se o usuário se autenticou com o Google
  
      const response = await axios.post('https://lufigu.onrender.com/cadastro', {
        name: name,
        email: email,
        password: isGoogleUser ? undefined : password, // Envie undefined para Google users
        confirmPassword: isGoogleUser ? undefined : confirmPassword, // Envie undefined para Google users
        isGoogleUser: isGoogleUser
      });
  
      console.log(response.data);
      window.location = 'https://lufigu.vercel.app/';
    } catch (error) {
      console.log(error);
    }
  };
  

  ////// FIM DO CADASTRO ///////

  //Adicinar produto

  const [preco, setPreco] = useState(0)
  const [sabor, setSabor] = useState('')
  const [nomeP, setNomeP] = useState('')
  const [descricao, setDescricao] = useState('')
  const [img, setImg] = useState('')
  const [estoque, setEstoque] = useState(0)

  const produtos = async () => {
    console.log({ preco, sabor, nomeP, descricao, img, estoque })
    try {
      const token = localStorage.getItem('token');
      const produto = await axios.post(
        'https://lufigu.onrender.com/produto',
        {

          variacoes: [
            {
              sabor: sabor,
              nome: nomeP,
              descricao: descricao,
              img: img,
              estoque: estoque,
              preco: preco
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      console.log(produto);
      await getProdutos()
      window.location = 'https://lufigu.vercel.app//admin'
    } catch (error) {
      console.log('Deu merda', error);
    }
  };

  const [precoU, setPrecoU] = useState(0)
  const [estoqueU, setEstoqueU] = useState(0)

  const updateProduto = async (id, variacaoId, preco, estoque) => {
    try {
      const response = await axios.put(`https://lufigu.onrender.com/update/${id}`, {
        preco: preco,
        variacaoId: variacaoId,
        estoque: estoque,
      });

      console.log(response)

      await getProdutos()
      window.location = 'https://lufigu.vercel.app//admin'

    } catch (error) {
      console.log('Erro ao atualizar produto:', error);
    }
  };

  const [precoS, setPrecoS] = useState(0)
  const [saborS, setSaborS] = useState('')
  const [nomeS, setNomeS] = useState('')
  const [descricaoS, setDescricaoS] = useState('')
  const [imgS, setImgS] = useState('')
  const [estoqueS, setEstoqueS] = useState(0)


  const addSabor = async (id) => {
  
    try {
      const response = await axios.put(`https://lufigu.onrender.com/adicionar/${id}`, {
        preco: precoS,
        sabor: saborS,
        nome: nomeS,
        descricao: descricaoS,
        img: imgS,
        estoque: estoqueS
      })

      console.log(response)
      await getProdutos()
      window.location = 'https://lufigu.vercel.app//admin'

    } catch (error) {
      console.log('Erro na rota add sabor', error.response.data.msg)
    }
  }

  const remove = async (produtoId, variacaoId) => {
    console.log(produtoId, variacaoId)
    try {
      const response = await axios.delete(`https://lufigu.onrender.com/produto/${produtoId}/variacao/${variacaoId}`);
      console.log(response.data.msg);

      await getProdutos();
    } catch (error) {
      console.log('Erro ao remover a variação:', error);
    }
  };




  useEffect(() => {
    getProdutos()
  }, [])

  return (
    <AuthProvider>
      <CartProvider>
        <div className="App">
          <Routes>
            <Route path='/' element={<Home produtosHome={Object.values(produtosUnico)} />} />

            <Route path='/sobre' element={<Sobre/>} />
            <Route path='/produto/:id' element={<UnicoProduto produtosUnico={produtosUnico} />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/pix' element={<ProtectedRoute element={PagamentoPix}
              params={{
                produtosUnico,
                setProdutosUnico
              }}
            />} />

            <Route path='/dinheiro' element={<ProtectedRoute element={Dinheiro}
              params={{
                produtosUnico,
                setProdutosUnico
              }}
            />} />
            <Route path='/login' element={<Login />} />

            <Route path='/update/:id' element={<ProtectedRoute element={Atualizar} role='admin'
              params={{
                precoU,
                setPrecoU,
                estoqueU,
                setEstoqueU,
                updateProduto,
              }}
            />} />

            <Route path='/admin' element={<ProtectedRoute element={Admin} role="admin"
              params={{
                produtosUnico,
                remove
              }}
            />} />

            <Route path='/adicionar' element={
              <ProtectedRoute
                element={Adicionar}
                role="admin"
                params={{
                  preco,
                  sabor,
                  nome: nomeP,
                  descricao,
                  img,
                  estoque,
                  setPreco,
                  setSabor,
                  setNome: setNomeP,
                  setDescricao,
                  setImg,
                  setEstoque,
                  produtos
                }}
              />
            } />

            <Route path='/cadastro' element={
              <Cadastro
                cadastro={cadastro}
                name={name}
                email={email}
                password={password}
                confirmPassword={confirmPassword}
                setName={setName}
                setEmail={setEmail}
                setPassword={setPassword}
                setConfirmPassword={setConfirmPassword} />} />

            <Route path="/adicionar/:id" element={<ProtectedRoute element={AdicionarSabor}
              params={{
                precoS,
                nomeS,
                imgS,
                descricaoS,
                estoqueS,
                saborS,
                setPrecoS,
                setSaborS,
                setNomeS,
                setDescricaoS,
                setImgS,
                setEstoqueS,
                addSabor
              }} />} />


          </Routes>

        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
