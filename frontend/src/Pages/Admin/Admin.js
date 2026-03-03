import React, { useEffect, useState } from 'react';
import '../Admin/Admin.css';
import { IoAddSharp as Add } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { FaTrashCan as Remove } from "react-icons/fa6";
import { Back } from '../../components/Back/Back';

export const Admin = ({ produtosUnico, remove }) => {

  const [mobile, setMobile] = useState(false)
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
  console.log(produtosUnico);

  return (
    <>
      <div className='chefe'>
        <Back tamanho={40} top={mobile ? 5 : 4} left={2} color={'white'} caminho={' '} />
        <h1 style={{ color: 'white' }}>Bom dia Chefe !</h1>
      </div>

      <div className='divDii'>
        <Link to='/adicionar'>
          <div className='add'>
            <Add style={{ fontSize: '40px', color: 'white' }} />
          </div>
        </Link>
        <div className='produtos-list'>
          {Object.values(produtosUnico).map(produto => (
            <ProdutoCard key={produto._id} produto={produto} remove={remove} />
          ))}
        </div>
      </div>


    </>
  );
};
const ProdutoCard = ({ produto, remove }) => {

  const [index, setIndex] = useState(0);

  const handleNext = () => {
    if (index < produto.variacoes.length - 1) {
      setIndex(index + 1);
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };






  // Verifica se a variação atual existe
  const variacao = produto.variacoes && produto.variacoes[index];
  if (!variacao) {
    return null; // ou renderizar uma mensagem de erro ou um fallback
  }

  const variaID = variacao._id;

  return (
    <div className='produto-card'>

      <button className='rere' onClick={() => remove(produto._id, variaID)} >
        <Remove style={{ color: 'white', fontSize: '20px' }} />
      </button>


      <Link to={`/update/${produto._id}?variacaoId=${variacao._id}`}>



        <div className='produto-content'>
          <p>Preço: {variacao.preco}</p>
          <div className='produto-img-container'>
            {variacao.img && <img src={variacao.img} alt={variacao.nome} className='produto-img' />}
          </div>
          <p>Sabor: {variacao.sabor}</p>
          <p>Nome: {variacao.nome}</p>
          <p>Descrição: {variacao.descricao}</p>
          <p>Estoque: {variacao.estoque}</p>
        </div>
      </Link>
      <Link to={`/adicionar/${produto._id}`}>
        <button>Adicionar Sabor</button>
      </Link>

      {produto.variacoes.length > 1 && (
        <div className='produto-navigation'>
          <button onClick={handlePrev} disabled={index === 0}>Anterior</button>
          <button onClick={handleNext} disabled={index === produto.variacoes.length - 1}>Próximo</button>
        </div>
      )}
    </div>
  );
};
