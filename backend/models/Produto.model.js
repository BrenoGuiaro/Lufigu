import { model, Schema } from "mongoose";

const variacaoSchema = new Schema({
  sabor: {
    type: String,
    required: true
  },
  nome: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  estoque: {
    type: Number,
    required: true
  },
  preco: {
    type: Number,
    required: true,
    min: 0
  }
});

const produtoSchema = new Schema({
  variacoes: {
    type: [variacaoSchema],
    required: true
  }
});

const Produto = model('Produto', produtoSchema);

export default Produto;
