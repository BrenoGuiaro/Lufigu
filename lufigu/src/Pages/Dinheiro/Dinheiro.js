
import React, { useContext, useState } from 'react';
import '../Dinheiro/Dinheiro.css';
import { FaMoneyBillWave as Money } from "react-icons/fa";
import { Back } from '../../components/Back/Back';
import { useCart } from '../CartContext/CartContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../AuthContext/AuthProvider';

export const Dinheiro = ({ produtosUnico, setProdutosUnico }) => {
    const { user } = useContext(AuthContext);
    const { cart, clearCart, total } = useCart();
    const [name, setName] = useState(user ? user?.name : ' ');
    const [date, setDate] = useState('');
    const [needsChange, setNeedsChange] = useState('Sim');
    const [showModal, setShowModal] = useState(false);
    const [showRequired, setShowRequired] = useState(false);

    const handleConfirm = async () => {
        if (!name || !date) {
            setShowRequired(true);
            return;
        }

        const updatedProdutos = { ...produtosUnico };

        for (const cartItem of cart) {
            const [produtoId, saborId] = cartItem.id.split('-');
            const produto = updatedProdutos[produtoId];

            if (produto) {
                const sabor = produto.variacoes.find(variacao => variacao._id === saborId);
                if (sabor && sabor.estoque >= cartItem.quantity) {

                    try {
                        await axios.put(`http://localhost:5000/produto/${produtoId}/atualizar-estoque`, {
                            saborId,
                            quantidadeComprada: cartItem.quantity
                        });
                    } catch (error) {
                        console.error('Erro ao atualizar o estoque:', error);

                    }
                }
            }
        }


        const itemsList = cart.map(item => `• ${item.nome} x ${item.quantity} - R$${item.precoTotal.toFixed(2)}`).join('\n');
        const message = `Eu ${name} gostaria de comprar os seguintes produtos 🛒\n${itemsList}\n\nTroco:${needsChange}\n Data de Entrega: ${date}💰Total: R$${total.toFixed(2)}`;

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        setShowModal(true);
    };

    const closeRequired = () => {
        setShowRequired(false);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        clearCart();
    };

    return (
        <>
            <div className='boxTitulo4'>
                <Back top={25} tamanho={35} left={2} color={'white'} caminho={'cart'} />
                <h2>Pagamento em Dinheiro</h2>
                <Money style={{ fontSize: '30px', position: 'absolute', left: '89%', color: 'green' }} />
            </div>

            <div className='dinheiro'>
                <div className='fflex'>
                    <h4>Nome Completo</h4>
                    <input
                        type='text'
                        id='name'
                        className='input6'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className='fflex'>
                    <h4>Data de Entrega</h4>
                    <input
                        type='date'
                        id='date'
                        className='input6'
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>

                <div className='fflex'>
                    <h4>Irá precisar de troco?</h4>
                    <select
                        className='input6'
                        value={needsChange}
                        onChange={(e) => setNeedsChange(e.target.value)}
                        required
                    >
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                    </select>
                </div>
            </div>

            <button
                onClick={handleConfirm}
                id='btn'
                style={{ marginTop: '30px' }}
            >
                Confirmar compra
            </button>

            {showModal && (
                <div className='modal'>
                    <div className='modal-content'>
                        <h3 style={{ marginBottom: '20px' }}>Obrigado, {name}!</h3>
                        <p>Sua compra foi realizada com sucesso.</p>
                        <Link to={'/'}>
                            <button onClick={handleCloseModal} id='btn' style={{ marginTop: '20px' }}>Fechar</button>
                        </Link>
                    </div>
                </div>
            )}

            {showRequired && (
                <div className='modal'>
                    <div className='modal-content'>
                        <p>🚨 Por favor insira os dados necessários! 🚨</p>
                        <button onClick={closeRequired} id='btn' style={{ marginTop: '20px' }}>Fechar</button>
                    </div>
                </div>
            )}
        </>
    );
};
