import express from "express";
import User from "../models/UserModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Produto from "../models/Produto.model.js";
import dotenv from 'dotenv'
import { v4 as uuidv4 } from 'uuid';
import { MercadoPagoConfig, Payment } from 'mercadopago';
 
const route = express()
dotenv.config()

route.get('/', (req, res) => {
    res.send('Ola')
})


function checkToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(400).json({ msg: 'Acesso Negado' });
    }

    try {
        const secret = process.env.SECRET;
        jwt.verify(token, secret);
        next();
    } catch (error) {
        return res.status(500).json({ msg: 'Token inválido' });
    }
}

//Rotas Privada

function checkRole(role) {
    return async (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(400).json({ msg: 'Acesso Negado' });
        }

        try {
            const secret = process.env.SECRET;
            const decoded = jwt.verify(token, secret);

            // Verifica o role do usuário no banco de dados
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(403).json({ msg: 'Usuário não autorizado' });
            }

            if (user.role !== role) {
                return res.status(403).json({ msg: 'Permissão insuficiente' });
            }

            next();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: 'Erro no servidor' });
        }
    };
}

route.get('/admin', checkRole('admin'), (req, res) => {
    res.status(200).json({ msg: "Bem-vindo à página de administração!" });
});

route.post('/produto', checkRole('admin'), async (req, res) => {
    const { variacoes } = req.body;


    if (!Array.isArray(variacoes) || variacoes.length === 0) {
        return res.status(400).json({ msg: 'Por favor, insira os dados das variações do produto' });
    }


    for (const variacao of variacoes) {
        const { sabor, nome, descricao, img, estoque, preco } = variacao;
        if (!sabor || !nome || !descricao || !img || estoque === undefined || preco === undefined) {
            return res.status(400).json({ msg: 'Dados da variação inválidos' });
        }
    }

    try {
        const novoProduto = new Produto({
            variacoes
        });

        await novoProduto.save();
        res.status(200).json({ msg: "Produto criado com sucesso", produto: novoProduto });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erro ao criar o produto. Tente novamente mais tarde.' });
    }
});



const client = new MercadoPagoConfig({
    accessToken: `${process.env.ACESS_TOKEN}`,
    options: { timeout: 5000, idempotencyKey: uuidv4() }
});
const payment = new Payment(client);

route.post('/criar-pix', async (req, res) => {
    try {
        const body = {
            transaction_amount: parseFloat(req.body.transaction_amount),
            description: req.body.description,
            payment_method_id: 'pix',
            payer: {
                email: req.body.email,
                identification: {
                    type: req.body.identificationType,
                    number: req.body.identificationNumber
                }
            }
        };



        const idempotencyKey = uuidv4();
        const requestOptions = { idempotencyKey: idempotencyKey };
        const result = await payment.create({ body, requestOptions });

        

        const transactionAmount = result?.body?.transaction_amount;
       

        const qrCodeBase64 = result?.point_of_interaction?.transaction_data?.qr_code_base64;

        if (qrCodeBase64) {
            res.json({
                message: 'Pagamento Pix criado com sucesso',
                qrCodeUrl: qrCodeBase64,
                result: result
            });
        } else {
            throw new Error('QR Code não encontrado na resposta da API');
        }
    } catch (error) {
        console.error('Erro ao criar o pagamento Pix:', error.message);
        console.error('Detalhes do erro:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.message });
    }
});



route.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Por favor insira seus dados' });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(400).json({ msg: 'Usuário não encontrado' });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
        return res.status(400).json({ msg: 'Senha inválida' });
    }

    try {
        const secret = process.env.SECRET;
        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name, email: user.email },
            secret,
            { expiresIn: '1d' }
        );

        res.status(200).json({ msg: 'Login bem-sucedido', token, user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Erro no servidor. Tente novamente mais tarde.' });
    }
});

route.get('/produto/:id', async (req, res) => {
    try {
        const produto = await Produto.findById(req.params.id); // Encontrar produto pelo ID

        if (!produto) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        res.json({ produto });
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

route.get('/produtos', async (req, res) => {
    try {
        const produtos = await Produto.find()
        res.status(200).json({ produtos })
    } catch (error) {
        return res.status(500).json({ msg: "tente novamente mais tarde" })
    }
})

route.put('/produto/:id/atualizar-estoque', async (req, res) => {
    const { id } = req.params;
    const { saborId, quantidadeComprada } = req.body;

    try {
        const produto = await Produto.findById(id);

        if (!produto) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        const variacao = produto.variacoes.find(variacao => variacao._id.toString() === saborId);

        if (!variacao) {
            return res.status(404).json({ message: 'Variação de sabor não encontrada' });
        }

        if (variacao.estoque < quantidadeComprada) {
            return res.status(400).json({ message: 'Estoque insuficiente' });
        }


        variacao.estoque -= quantidadeComprada;


        await produto.save();

        res.status(200).json({ message: 'Estoque atualizado com sucesso', produto });
    } catch (error) {
        console.error('Erro ao atualizar o estoque:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

route.put('/update/:id', async (req, res) => {
    try {
        const produtoId = req.params.id;
        const { preco, variacaoId, estoque } = req.body;

        if (!variacaoId || !estoque || !preco) {
            return res.status(400).json({ msg: 'Dados incompletos' });
        }

        const produto = await Produto.findById(produtoId);
        if (!produto) {
            return res.status(404).json({ msg: 'Produto não encontrado' });
        }

        const variacao = produto.variacoes.id(variacaoId);
        if (!variacao) {
            return res.status(404).json({ msg: 'Variação não encontrada' });
        }

        variacao.preco = preco;
        variacao.estoque = estoque;

        await produto.save();

        res.json({ msg: 'Produto atualizado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erro no servidor' });
    }
});



route.delete('/produto/:produtoId/variacao/:variacaoId', async (req, res) => {
    const { produtoId, variacaoId } = req.params;


    try {
        const produto = await Produto.findById(produtoId);
        if (!produto) {
            return res.status(404).json({ msg: 'Produto não encontrado' });
        }

        const variacaoIndex = produto.variacoes.findIndex(variacao => variacao._id.toString() === variacaoId);
        if (variacaoIndex === -1) {
            return res.status(404).json({ msg: 'Variação não encontrada' });
        }


        produto.variacoes.splice(variacaoIndex, 1);


        await produto.save();

        res.status(200).json({ msg: 'Variação removida com sucesso!' });
    } catch (error) {
        console.error('Erro ao remover a variação:', error);
        res.status(500).json({ msg: "Erro no servidor ao tentar remover a variação", error });
    }
});


route.put('/adicionar/:id', async (req, res) => {
    const { id } = req.params;
    const { sabor, nome, descricao, img, estoque, preco } = req.body;

    if (!sabor || !nome || !descricao || !img || !estoque || !preco) {
        return res.status(400).json({ msg: 'Por favor, insira todos os dados da variação' });
    }

    try {
        const produto = await Produto.findById(id);
        if (!produto) {
            return res.status(404).json({ msg: 'Produto não encontrado' });
        }

        const novaVariacao = {
            sabor,
            nome,
            descricao,
            img,
            estoque,
            preco
        };

        produto.variacoes.push(novaVariacao);

        await produto.save();

        res.status(200).json({ msg: 'Nova variação adicionada com sucesso', produto });
    } catch (error) {
        console.error('Erro ao adicionar variação:', error);
        res.status(500).json({ msg: 'Erro interno do servidor' });
    }
});


route.post('/login-google', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ msg: 'Por favor insira seus dados' });
    }

    let user = await User.findOne({ email: email });

    if (user) {

        try {
            const secret = process.env.SECRET;
            const token = jwt.sign(
                { id: user._id, role: user.role, name: user.name, email: user.email },
                secret,
                { expiresIn: '1d' }
            );

            res.status(200).json({ msg: 'Login bem-sucedido', token, user });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: 'Erro no servidor. Tente novamente mais tarde.' });
        }
    }
    if (!user) {
        res.status(500).json({ msg: 'Faça seu cadastro por favor' })
    }
});


route.post('/cadastro', async (req, res) => {
    const { name, email, password, confirmPassword, isGoogleUser } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Usuário já existe!' });
        }

        if (isGoogleUser) {
            user = new User({ name, email, isGoogleUser: true });


        } else {

            if (!password || password != confirmPassword) {
                console.log('1', password, confirmPassword)
                return res.status(400).json({ msg: 'Senhas não coincidem' });
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            user = new User({ name, email, password: hashedPassword });



        }
        await user.save();
        res.status(201).json({ msg: 'Usuário cadastrado com sucesso!' });





    } catch (error) {
        res.status(500).json({ error: 'Erro no servidor' });
    }
});


export default route