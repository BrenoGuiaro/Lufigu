import React from 'react'
import { useParams } from 'react-router-dom';

export const AdicionarSabor = ({
    precoS,
    estoqueS,
    descricaoS,
    imgS,
    nomeS,
    saborS,
    setPrecoS,
    setSaborS,
    setNomeS,
    setDescricaoS,
    setImgS,
    setEstoqueS,
    addSabor
}) => {

    const {id} = useParams()
    const handlePrecoChange = (e) => {
        const intPreco = parseFloat(e.target.value, 10);
        setPrecoS(intPreco);
    };


    const handleEstoqueChange = (e) => {
        const intEstoque = parseInt(e.target.value, 10);
        setEstoqueS(intEstoque);
    };
    return (
        <>
            <div className='bbbo'>
                <h3>Adicionar Sabor</h3>
                <div className='boxII'>
                    <div className='centerww'>
                        <label>Preco:</label>
                        <input
                            type="number"
                            value={precoS}
                            onChange={handlePrecoChange}
                            className='input8'
                        />
                    </div>

                    <div className='centerww'>
                        <label>Sabor:</label>
                        <input
                            type="text"
                            value={saborS}
                            onChange={(e) => setSaborS(e.target.value)}
                            className='input8'
                        />
                    </div>

                    <div className='centerww'>
                        <label>Nome:</label>
                        <input
                            type="text"
                            value={nomeS}
                            onChange={(e) => setNomeS(e.target.value)}
                            className='input8'
                        />
                    </div>

                    <div className='centerww'>
                        <label>Descricao:</label>
                        <input
                            type="text"
                            value={descricaoS}
                            onChange={(e) => setDescricaoS(e.target.value)}
                            className='input8'
                        />
                    </div>

                    <div className='centerww'>
                        <label>Img:</label>
                        <input
                            type="text"
                            value={imgS}
                            onChange={(e) => setImgS(e.target.value)}
                            className='input8'
                        />
                    </div>

                    <div className='centerww'>
                        <label>Estoque:</label>
                        <input
                            type="number"
                            value={estoqueS}
                            onChange={handleEstoqueChange}
                            className='input8'
                        />
                    </div>
                </div>
                <button type="submit" onClick={()=> addSabor(id)} id='btn12'>Cadastrar</button>
            </div>
        </>
    )
}
