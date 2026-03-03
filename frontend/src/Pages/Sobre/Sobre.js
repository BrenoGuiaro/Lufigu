import React from 'react'
import { Back } from '../../components/Back/Back'
import '../Sobre/Sobre.css'
import gustavo from '../Sobre/gugu.jpg'
import luigi from '../Sobre/lulu.jpg'
import breno from '../Sobre/bebe.jpg'

export const Sobre = () => {


  return (
    <>
      <div className= 'boxTM' >
        <Back tamanho={40} top={25} left={5} color={'white'} caminho={' '} />
        <h2>Sobre Nos</h2>
      </div>

      <div className='bobox'>
        <div className='bbbo4'>
          <p style={{textAlign: 'start', marginBottom: '50px'}}>Nos da empresa Lufigu , decidimos criar esse projeto após ver a necessidade de um docinho após o almoço nos dias de Senai, bom a nossa empresa é composta por 3 membros ultra mentes qualificados para essa vaga, sendo eles Luigi, um dos caras mais alto da escola Sesi 357, Gustavo o barbeiro mais fudido de Mococa e Breno o vagabundo, bom agora vamos ver um pouco mais sobre cada um deles,  </p>

          <h4>Gustavo o Barbeiro </h4>
          <img src={gustavo} className='imgag' alt='gustavo' />

          <p style={{textAlign: 'start', marginBottom: '50px'}}>Gustavo estuda na escola Sesi desde o primeiro aninho, e atualmente se encontra no último ano da escola, tem 17 anos e sonha em ser barbeiro algum dia, e quando soube da possibilidade de ser um empreendedor ele não pensou duas vezes decidiu cair DE BOCA 😋 🍆 nesse projeto para descolar uma graninha para sua barbearia </p>

          <h4>Luigi o Bicicleteiro </h4>
          <img src={luigi} className='imgag' alt='luigi'/>

          <p style={{textAlign: 'start', marginBottom: '50px'}}>Luigi tem 17 anos e meche com bicicleta desde novinho, ele sempre gostou de aprender um pouco mais sobre bicicletas e automóveis, e atualmente o maior sonho dele é ter sua carta de habilitação, para poder comprar uma saveiro, bom e o resto você já sabe 😉😈, decidiu entrar nesse projeto pois percebeu a possibilidade de trazer algo que o povo tanto quer e poder ter um ganho extra </p>

          <h4>Breno o vagabundo</h4>
          <img src={breno} className='imgag' alt='breno'/>

          <p style={{textAlign: 'start', marginBottom: '50px'}}>Breno tem 17 anos e é um VAGABUNDO, diferente do Gustavo e do Luigi, Breno não trabalha com tanta frequência e na maioria do seu tempo está na academia ou aprendendo mais sobre a área que ele tem interesse, no dia em que ele junto com seu amigo Luigi percebeu a oportunidade de ter um “negócio”, viu também a oportunidade de fazer um site para isso, e assim aprimorar seus conhecimentos só que ele só copiou do chatGpt 

</p>

  
        </div>
      </div>
    </>
  )
}
