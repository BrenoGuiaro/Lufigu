import React, { useContext, useState } from 'react';
import axios from 'axios';
import '../PagamentoPix/PagamentoPix.css'
import { useCart } from '../../Pages/CartContext/CartContext';
import { Back } from '../../components/Back/Back';
import { Link } from 'react-router-dom';
import { Close } from '../../components/Close/Close';
import { FaPix as Pix } from "react-icons/fa6";
import { AuthContext } from '../AuthContext/AuthProvider';
import { FaCheckCircle as Certo } from "react-icons/fa";

export const PagamentoPix = ({ produtosUnico, setProdutosUnico }) => {
  const { total, clearCart, cart } = useCart();
  const { user } = useContext(AuthContext);
  console.log('USERRRR', user)

  const [formData, setFormData] = useState({
    description: user?.name,
    email: user?.email,
    identificationType: 'CPF',
    identificationNumber: ''
  });

  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [copia, setCopia] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [certoC, setCertoC] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const confirmAlert = async () => {
    const updatedProdutos = { ...produtosUnico };

    cart.forEach((cartItem) => {
      const [produtoId, saborId] = cartItem.id.split('-');
      const produto = updatedProdutos[produtoId];

      if (produto) {
        if (produto.variacoes) {
          const sabor = produto.variacoes.find(variacao => variacao._id === saborId);
          if (sabor && sabor.estoque >= cartItem.quantity) {
            sabor.estoque -= cartItem.quantity;
          }
        } else if (produto.estoque >= cartItem.quantity) {
          produto.estoque -= cartItem.quantity;
        }
      } else {
        console.error(`Produto com ID ${produtoId} não encontrado.`);
      }
    });

    localStorage.setItem('produtosUnico', JSON.stringify(updatedProdutos));
    setProdutosUnico(updatedProdutos);
    clearCart();

    try {

      await Promise.all(cart.map(async (cartItem) => {
        const [produtoId, saborId] = cartItem.id.split('-');
        const quantidadeComprada = cartItem.quantity;

        try {
          await axios.put(`http://localhost:5000/produto/${produtoId}/atualizar-estoque`, {
            saborId,
            quantidadeComprada
          });
        } catch (error) {
          console.error('Erro ao atualizar o estoque:', error);
          setErrorMessage('Erro ao atualizar o estoque.');
        }
      }));
    } catch (error) {
      console.error('Erro ao atualizar o estoque:', error);
      setErrorMessage('Erro ao atualizar o estoque.');
    }
  };

  const copiarHash = () => {
    const input = document.getElementById("copiar");


    navigator.clipboard.writeText(input.value)


    try {

      setCertoC(true)
    } catch (error) {
      console.error("Erro ao copiar o texto: ", error);
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    const dataToSend = {
      transaction_amount: parseFloat(total.toFixed(2)),
      ...formData,
    };



    try {
      const response = await axios.post('http://localhost:5000/criar-pix', dataToSend);


      const copiaCola = response.data.result.point_of_interaction.transaction_data.qr_code



      const qrCodeUrl = response.data.qrCodeUrl;

      if (qrCodeUrl && copiaCola) {
        setQrCodeUrl(qrCodeUrl);
        setCopia(copiaCola)
        setErrorMessage('');
        console.log('Pix criado com sucesso!');
      } else {
        setErrorMessage('Erro: QR Code não encontrado na resposta.');
      }
    } catch (error) {
      console.log('PIXXXXX', dataToSend)

      console.error('Erro ao criar o pagamento Pix:', error);
      setErrorMessage('Erro ao criar o pagamento Pix.');
    }
  };

  const testeee = () => {
    setCertoC(false)
    setQrCodeUrl(false)

  }





  return (
    <>
      <div className='boxTitulo4'>
        <Back color='white' tamanho='40' top={'25'} left={'3'} caminho={'cart'} />
        <h1>Pagamento Pix</h1>
        <Pix style={{ fontSize: '30px', color: '#1cbd9a', position: 'absolute', left: '85%' }} />
      </div>

      <div className='divTUDO'>

        <form onSubmit={handleSubmit} className='form'>
          <div className='divinse'>
            <label>Nome Completo:</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className='inputINSE'
            />
          </div>

          <div className='divinse'>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className='inputINSE'
              id='email'
            />
          </div>

          <div className='divinse'>
            <label id='label'>Tipo de Identificação:</label>
            <select
              name="identificationType"
              value={formData.identificationType}
              onChange={handleChange}
              required
              className='inputINSE2'
            >
              <option value="CPF">CPF</option>
              <option value="CNPJ">CNPJ</option>
              <option value="PHONE">Número de Telefone</option>
              <option value="EMAIL">Email</option>
              <option value="RANDOM">Chave Aleatória</option>
            </select>
          </div>

          <div className='divinse'>
            <label>Número de Identificação:</label>
            <input
              type="text"
              name="identificationNumber"
              value={formData.identificationNumber}
              onChange={handleChange}
              required
              className='inputINSE'
            />
          </div>

        </form>

        <div className='btnCONFIRMAR'>
          <button type="submit" id='btn' onClick={handleSubmit}>Criar QR Code</button>
        </div>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        {qrCodeUrl && (
          <>
            <div className='divQR'>
              <h3 style={{ color: 'white', padding: '10px', background: 'grey', marginBottom: '20px', borderRadius: '8px' }}>QR Code para pagamento:</h3>
              <img src={`data:image/png;base64,${qrCodeUrl}`} alt="QR Code Pix" id='imgQR' />
              <Link to={'/'}>
                <button onClick={confirmAlert} id='btn' style={{ marginTop: '30px' }}>Confirmar compra</button>
              </Link>
              {copia && (
                <>
                  <label for="copiar" style={{color:'white', fontSize: '15px', fontWeight:'bold'}}>Copiar Hash:</label>
                  <div className='boxCopia'>

                    <input type="text" id="copiar" value={copia} readonly />
                    <button onClick={copiarHash} id='btnCopiar'>Copiar</button>


                  </div>
                </>
              )}

              {certoC && (
                <div className='boxCERTO'>
                  <div className='boxBCer'>
                    <h3>Texto Copiado com sucesso !</h3>
                    <Certo id='right' />
                    <button id='btnC' onClick={() => { setCertoC(false) }} >Fechar</button>
                  </div>
                </div>
              )}

              <button onClick={testeee}  ><Close tamanho={50} color={'white'} top={5} left={2} caminho={'pix'} /></button>


            </div>
          </>
        )}





      </div>
    </>
  );
};
