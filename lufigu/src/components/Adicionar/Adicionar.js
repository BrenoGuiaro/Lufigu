import React from 'react';
import '../Adicionar/Adicionar.css'
import { Back } from '../Back/Back';

export const Adicionar = ({
  preco,
  sabor,
  nome,
  descricao,
  img,
  estoque,
  setPreco,
  setSabor,
  setNome,
  setDescricao,
  setImg,
  setEstoque,
  produtos,
}) => {


  const handlePrecoChange = (e) => {
    const intPreco = parseFloat(e.target.value, 10);
    setPreco(intPreco);
  };


  const handleEstoqueChange = (e) => {
    const intEstoque = parseInt(e.target.value, 10);
    setEstoque(intEstoque);
  };

  return (
    <>

      <div className='bbbo'>
        <Back tamanho={40} color={'white'} top={5} left={2} caminho={'admin'}/>
        <h3>Adicionar produtos</h3>
        <div className='boxII'>
          <div className='centerww'>
            <label>Preco:</label>
            <input
              type="number"
              value={preco}
              onChange={handlePrecoChange}
              className='input8'
            />
          </div>

          <div className='centerww'>
            <label>Sabor:</label>
            <input
              type="text"
              value={sabor}
              onChange={(e) => setSabor(e.target.value)}
              className='input8'
            />
          </div>

          <div className='centerww'>
            <label>Nome:</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className='input8'
            />
          </div>

          <div className='centerww'>
            <label>Descricao:</label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className='input8'
            />
          </div>

          <div className='centerww'>
            <label>Img:</label>
            <input
              type="text"
              value={img}
              onChange={(e) => setImg(e.target.value)}
              className='input8'
            />
          </div>

          <div className='centerww'>
            <label>Estoque:</label>
            <input
              type="number"
              value={estoque}
              onChange={handleEstoqueChange}
              className='input8'
            />
          </div>
        </div>
        <button type="submit" onClick={produtos} id='btn12'>Cadastrar</button>
      </div>

      
    </>
  );
};
