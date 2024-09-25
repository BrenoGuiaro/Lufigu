import React, { useEffect, useState } from 'react';
import { useCart } from '../../Pages/CartContext/CartContext';
import '../Cart/Cart.css';
import { MdOutlineRemoveShoppingCart as NotCart } from "react-icons/md";
import { Back } from '../Back/Back';
import { AiOutlineClear as Clear } from "react-icons/ai";
import { RiDeleteBinLine as Remove } from "react-icons/ri";
import { FaPix as Pix } from "react-icons/fa6";
import { IoMdClose as X } from "react-icons/io";
import { FaMoneyBillWave as Money } from "react-icons/fa";
import { Link } from 'react-router-dom';

export const Cart = () => {

    const { cart, total, removeFromCart, clearCart, addToCart, removeItemCart } = useCart();

    console.log(cart)

    const [mobile, setMobile] = useState(false)

    const [clearMobile, setClearMobile] = useState(false)


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 420) {
                setMobile(true);
                setClearMobile(true)

            } else {
                setMobile(false);
                setClearMobile(false)
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    })


    const handleAddToCart = (item) => {

        const itemN = {
            id: item.id,
            img: item.img,
            nome: item.nome,
            preco: item.preco,
            quantity: +1,
        };
        addToCart(itemN)
    }

    const handleRemoveCart = (item) => {
        removeFromCart(item)
    }

    const handleRemoveItemCart = (item) => {
        removeItemCart(item)
    }


    const [isBoxConfirmVisible, setIsBoxConfirmVisible] = useState(cart.length > 0);
    const [isDivParaFVisible, setIsDivParaFVisible] = useState(false);

    useEffect(() => {
        setIsBoxConfirmVisible(cart.length > 0);
    }, [cart]);


    const sumirDivF = () => {
        setIsDivParaFVisible(false);
    };

    const handleClear = () => {
        clearCart();
        setClearMobile(false)
        setIsDivParaFVisible(false);
    };

    const handleFinalizePurchase = () => {
        setIsDivParaFVisible(true);

    };







    return (
        <>
            <div>
                <div className='boxCarinho'>
                    <Back tamanho='40' color='white' top={mobile ? '3' : '9'} left='2' caminho={' '} />
                    <h1 style={{ fontSize: '20px', color: 'white' }}>Carrinho de Compras</h1>
                </div>
                <div className='fundoCar'>




                    <div className='fundoDaList'>
                        {cart.length === 0 ? (
                            <div className='boxNot'>
                                <NotCart style={{ color: 'black', fontSize: '60px', }} />
                                <h3 className='notText'>Não tem nada no seu carrinho</h3>
                            </div>
                        ) : (
                            <div className='boxList'>
                                {cart.map((item) => (
                                    <div key={item.id} className='boxProd'>
                                        <div className='boxIC'>
                                            <img src={item.img} alt='' id='imgC' />
                                        </div>
                                        <div className='boxIC2'>
                                            <div className='boxTD'>
                                                <div className='boxL'>
                                                    <h4>{item.nome}</h4>
                                                </div>
                                                <div className='boxD'>
                                                    <button onClick={() => { handleRemoveCart(item.id) }} className='menos'>-</button>
                                                    <p>x{item.quantity}</p>
                                                    <button onClick={() => { handleAddToCart(item) }} className='mais'>+</button>
                                                </div>
                                                <div className='boxTotal'>
                                                    <p>Total: </p>
                                                    <p style={{ fontWeight: 'bold' }}>R${item.precoTotal.toFixed(2)}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => { handleRemoveItemCart(item.id) }} className='remove'><Remove style={{ fontSize: '22px', color: 'white' }} /></button>
                                        </div>

                                    </div>
                                ))}

                                {clearMobile &&

                                    <div className='clearMobile '>
                                        <button onClick={handleClear} style={{ background: 'none', width: '100%', height: '100%', borderRadius: '8px', border: 'none' }}>
                                            <Clear style={{ fontSize: '25px', color: 'white' }} />
                                        </button>

                                    </div>

                                }


                                <button onClick={handleClear} className='clear'><Clear style={{ fontSize: '25px', color: 'white' }} /></button>
                            </div>
                        )}
                    </div>
                    {isBoxConfirmVisible && (
                        <div className='boxConfirm'>
                            <div className='fundoTotal'>
                                <h4 id='tota' >Total da Compra: R${total.toFixed(2)}</h4>
                            </div>
                            <button id='btnFi' onClick={handleFinalizePurchase}>Finalizar Compra</button>
                        </div>
                    )}
                </div>
            </div>
            {isDivParaFVisible && (
                <div className='divParaF'>
                    <div className='boxFormas'>
                        <X onClick={sumirDivF} className='closeD' />
                        <h2 style={{ marginTop: '20px', marginBottom: '20px' }}>Qual a forma de pagamento? </h2>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div className='boxFF'>
                                <Link to={'/pix'}>
                                    <button className='btnPix'>
                                        <Pix style={{ fontSize: '20px', color: '#1cbd9a' }} />
                                        <p style={{ marginLeft: '7px' }}>PIX</p>
                                    </button>
                                </Link>
                                <Link to={'/dinheiro'}>
                                    <button className='btnDin'>
                                        <Money style={{ fontSize: '20px', color: 'green' }} /><p style={{ marginLeft: '7px' }}>Dinheiro</p>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
