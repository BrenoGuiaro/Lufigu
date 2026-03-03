// CartContext.js

import React, { createContext, useState, useContext, useMemo } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (item) => {
        setCart((prevCart) => {
            const itemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id);

            if (itemIndex >= 0) {
                const newCart = [...prevCart];
                newCart[itemIndex].quantity += item.quantity;
                newCart[itemIndex].precoTotal = newCart[itemIndex].precoUnitario * newCart[itemIndex].quantity;
                return newCart;
            }
            return [...prevCart, {
                ...item,
                precoTotal: item.preco * item.quantity,
                precoUnitario: item.preco
            }];
        });
    };

    const removeFromCart = (id) => {
        setCart((prevCart) => {
            const itemIndex = prevCart.findIndex(item => item.id === id);
            if (itemIndex >= 0) {
                const newCart = [...prevCart];
                if (newCart[itemIndex].quantity > 1) {
                    newCart[itemIndex].quantity -= 1;
                    newCart[itemIndex].precoTotal = newCart[itemIndex].precoUnitario * newCart[itemIndex].quantity;
                    return newCart;
                } else {
                    return newCart.filter(item => item.id !== id);
                }
            }
            return prevCart;
        });
    };

    const removeItemCart = (id) => {
        setCart((prevCart) => {
            return prevCart.filter(item => item.id !== id);
        });
    };


    const clearCart = () => {
        setCart([]);
    };

    const total = useMemo(() => {
        return cart.reduce((acc, item) => acc + item.precoTotal, 0);
    }, [cart]);

    const totalItems = useMemo(() => {
        return cart.reduce((acc, item) => acc + item.quantity, 0);
    }, [cart]);

    
    const updateStock = (produtosUnico) => {
        cart.forEach((cartItem) => {
            const produto = produtosUnico[cartItem.id];
            if (produto) {
                const sabores = produto.sabores || { default: produto };
                for (let sabor in sabores) {
                    if (sabores[sabor].nome === cartItem.nome) {
                        sabores[sabor].estoque -= cartItem.quantity;
                        console.log(sabores[sabor].estoque)
                    }
                }
            }
        });
    };

    return (
        <CartContext.Provider value={{ cart, total, totalItems, addToCart, removeFromCart, clearCart, updateStock , removeItemCart}}>
            {children}
        </CartContext.Provider>
    );
};
