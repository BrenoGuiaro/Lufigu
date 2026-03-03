import React from 'react';
import '../Produtos/Produtos.css';
import { Link } from 'react-router-dom';

export const Produtos = ({ produtosHome }) => {
  return (
    <div className='boxPds'>
      {produtosHome.map((item) => (
        <Link key={item._id} to={`/produto/${item._id}`}>
          <div className='boxPd1'>
            <img
              src={item.variacoes && item.variacoes[0] ? item.variacoes[0].img : ''}
              alt={item.variacoes && item.variacoes[0] ? item.variacoes[0].nome : 'Imagem indisponível'}
              className='img'
            />
            <h3>
              {item.variacoes && item.variacoes[0] ? item.variacoes[0].nome : 'Não tem Nome'}
            </h3>
            <p className='preco'>
            
              {item.variacoes && item.variacoes[0] && typeof item.variacoes[0].preco === 'number'
                ? `R$${item.variacoes[0].preco.toFixed(2)}`
                : 'Preço não disponível'}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};
