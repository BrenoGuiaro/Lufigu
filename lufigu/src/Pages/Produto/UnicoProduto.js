import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import '../Produto/UnicoProduto.css';
import { useCart } from '../CartContext/CartContext';
import { NavCar } from '../../components/NavCar/NavCar';
import { Back } from '../../components/Back/Back';
import { FaCartShopping as Cart } from "react-icons/fa6";
import { MdDoNotDisturbAlt as ProductNot} from "react-icons/md";

export const UnicoProduto = () => {
    const { id } = useParams();
    const [produto, setProduto] = useState(null);
    const [saborSelecionado, setSaborSelecionado] = useState(null);
    const [quantidade, setQuantidade] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [mobile, setMobile] = useState(false)
    const { addToCart, totalItems } = useCart();

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

    const fetchProduto = async () => {
        try {
            const response = await axios.get(`https://lufigu.onrender.com/produto/${id}`);
            const produtoData = response.data.produto;
            setProduto(produtoData);
            if (produtoData.variacoes && produtoData.variacoes.length > 0) {
                setSaborSelecionado(produtoData.variacoes[0]._id);
            }
        } catch (error) {
            console.error('Erro ao buscar o produto:', error);
        }
    };

    useEffect(() => {
        fetchProduto();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleProductUpdate = () => {
        fetchProduto();
    };

    if (!produto) {
        return <div className='productNot'>
            <div className='boxNNOT'>
                <Link>
                <Back tamanho={40} color={'white'} top={3} left={2} caminho={' '}/>
                </Link>
                <ProductNot id='productICON'/>
                <h3>Produto não encontrado</h3>
            </div>
        </div>;
    }

    const temSabores = produto.variacoes && produto.variacoes.length > 0;
    const sabor = temSabores ? produto.variacoes.find(variacao => variacao._id === saborSelecionado) : null;
    const maxQuantidade = sabor ? sabor.estoque : 0;

    const handleAddToCart = () => {
        if (isAdding) return;

        setIsAdding(true);
        console.log('TERERE', produto)
        console.log('TERER2E', sabor)

        const itemId = `${id}-${saborSelecionado}`;
        const item = {
            id: itemId,
            nome: sabor ? sabor.nome : 'Produto',
            preco: sabor.preco,
            quantity: quantidade,
            img: sabor ? sabor.img : ''
        };
        addToCart(item);

        setIsAdding(false);


        handleProductUpdate();
    };

    const handleQuantityChange = (event) => {
        const value = Math.max(1, Math.min(maxQuantidade, parseInt(event.target.value, 10) || 1));
        setQuantidade(value);
    };

    return (
        <>
            <div className='todo'>
                <Back color='white' top={mobile ? '2' : '3'} left='1' tamanho='40' caminho={' '} />

                <div className='boxImage'>


                    {mobile &&
                        <>
                            <div style={{ position: 'absolute', top: '3%', right: '5%' }}>
                                <Link to={'/cart'}>
                                    <Cart style={{ fontSize: '30px', color: 'white', }} />
                                </Link>

                                <span className='cart-count' style={{ top: '-25%', left: '-27%' }}>{totalItems}</span>

                            </div>


                            <div className='infoMobile'>
                                <h1>{sabor ? sabor.nome : 'Nome do Produto'}</h1>
                                <p>{sabor ? sabor.descricao : 'Descrição do Produto'}</p>
                            </div>
                        </>}

                    <img
                        src={sabor ? sabor.img : ''}
                        alt={sabor ? sabor.nome : 'Produto'}
                        id='imgPPL'
                    />
                    <div className='center6'>
                        <h2>R$:{sabor.preco.toFixed(2)}</h2>
                    </div>
                </div>

                <div className='infos'>
                    <div className='info1'>
                        <h1>{sabor ? sabor.nome : 'Nome do Produto'}</h1>
                        <p>{sabor ? sabor.descricao : 'Descrição do Produto'}</p>
                    </div>

                    <div className='divDasDiv'>
                        <div className='divSabor'>
                            {temSabores ? (
                                <div className='boxInt2'>
                                    <label>Escolha o sabor:</label>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        {produto.variacoes.map(variacao => (
                                            <button
                                                key={variacao._id}
                                                onClick={() => setSaborSelecionado(variacao._id)}
                                                style={{
                                                    margin: '5px',
                                                    padding: '10px',
                                                    backgroundColor: saborSelecionado === variacao._id ? '#383838' : 'grey',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '5px'
                                                }}
                                            >
                                                {variacao.sabor}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p>Este produto não possui variações de sabor.</p>
                            )}
                        </div>

                        <div className='divQuant'>
                            <div className='boxInt'>
                                <label>Quantidade:</label>
                                <select
                                    value={quantidade}
                                    onChange={handleQuantityChange}
                                    style={{ margin: '5px', padding: '10px', borderRadius: '5px', border: '1px solid grey', width: '55%' }}
                                >
                                    {Array.from({ length: maxQuantidade }, (_, index) => index + 1).map(number => (
                                        <option key={number} value={number}>
                                            {number}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <p style={{ margin: '35px' }}>Estoque disponível: {maxQuantidade}</p>

                    {maxQuantidade > 0 ? (
                        <button onClick={handleAddToCart} id='btn' disabled={isAdding}>
                            Adicionar ao Carrinho
                        </button>
                    ) :
                        <button id='indis'>
                            Item indisponivel
                        </button>
                    }
                </div>
                <div id='cartC'>
                    <NavCar />
                </div>
            </div>
        </>
    );
};
