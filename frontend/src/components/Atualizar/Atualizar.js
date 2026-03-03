import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Back } from '../Back/Back';
import '../Atualizar/Atualizar.css'

export const Atualizar = ({
  precoU,
  setPrecoU,
  estoqueU,
  setEstoqueU,
  updateProduto,
}) => {
  const { id } = useParams();
  const location = useLocation();
  const [variacaoId, setVariacaoId] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const variacaoIdFromURL = searchParams.get('variacaoId');
    if (variacaoIdFromURL) {
      setVariacaoId(variacaoIdFromURL);
    }
  }, [location.search]);

  const upUpdate = () => {
    const precoNumero = parseFloat(precoU);
    const estoqueNumero = parseInt(estoqueU, 10);

    updateProduto(id, variacaoId, precoNumero, estoqueNumero);
  };

  return (
    <>
      <div className='bbbo2' >
      <Back tamanho={40} color={'white'} top={5} left={2} caminho={'admin'}/>
        <h3>Atualizar Produto</h3>
        <div className='boxII'>
          <div className='centerww'>
            <label>Preço:</label>
            <input
              type="number"
              value={precoU}
              onChange={(e) => setPrecoU(e.target.value)}
              className='input8'
            />
          </div>

          <div className='centerww'>
            <label>Estoque:</label>
            <input
              type="number"
              value={estoqueU}
              onChange={(e) => setEstoqueU(e.target.value)}
              className='input8'
            />
          </div>
        </div>
        <button type="button" onClick={upUpdate} id='btn124'>Atualizar</button>
      </div>
    </>
  );
};
