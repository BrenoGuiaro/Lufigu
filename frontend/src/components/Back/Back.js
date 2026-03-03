import React from 'react'
import { IoMdArrowRoundBack as IconBack } from "react-icons/io";
import { Link } from 'react-router-dom';

export const Back = ({color,tamanho,top,left, caminho}) => {
    return (
        <Link to={`/${caminho}`}>
            <IconBack style={{ color: `${color}`, fontSize: `${tamanho}px`, position: 'absolute', top: `${top}%`, left: `${left}%` }} />
        </Link>
    )
}
