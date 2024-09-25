// NavCar.js

import React from 'react';
import { FaCartShopping as Cart } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { useCart } from '../../Pages/CartContext/CartContext';
import '../NavCar/NavCar.css';

export const NavCar = () => {
    const { totalItems } = useCart(); 

    return (
        <div className='navC'>
            <Link to='/cart'>
                <div className='cart-container'>
                    <Cart style={{ fontSize: '30px', color: 'white' }} />
                    <span className='cart-count'>{totalItems}</span>
                </div>
            </Link>
        </div>
    );
};
