import React from 'react'
import { IoClose as Fechar } from "react-icons/io5";
import { Link } from 'react-router-dom';

export const Close = ({ color, tamanho, top, left, caminho }) => {
    return (
        <>
            <Link to={`/${caminho}`}>
                <Fechar style={{ color: `${color}`, fontSize: `${tamanho}px`, top: `${top}%`, left: `${left}%`, position: 'absolute'}} />
            </Link>

        </>
    )
}
