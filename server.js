const express = require("express");
const { profileEnd } = require("node:console");
const { copyFileSync } = require("node:fs");
const app = express();

app.use(express.json());

// Criar lista de produtos

let produtos =  [
    {id: 1 , nome: "Notebook", preco : 2500, categoria : "informatica"},
    {id: 2 , nome: "Mouse", preco : 50, categoria : "informatica"},
    {id: 3 , nome: "PS4", preco : 2500, categoria : "informatica"},
    {id: 4 , nome: "Monitor", preco : 2500, categoria : "informatica"},
    {id: 5 , nome: "PS4", preco : 2500, categoria : "informatica"},
];


// GET - mensagem de boas vindas
app.get("/", (req,res) =>
{
    res.json({ mensagem : "Bem vindo a minha API!"});
});


//GET - listar produtos
app.get("/produtos",(req,res) =>{
    const categoria = req.query.categoria

    if(categoria)
    {
        // filtrar por categoria se fornecida
        const filtrados = produtos.filter((p) => p.categoria === categoria);
        return res.json(filtrados);
    }

    res.json(produtos);
});

//GET - Buscar um produto especifico(parametro de rota)

app.get("/produtos/:id", (req,res) =>{
    const id = parseInt(req.params.id);
    const produto = produtos.find((p) => p.id === id);

    if (!produto){
        return res.status(404).json({ erro: "Produto não encontrado"});
    }

    res.json(produto);
});

// POST - Criar novo produto
app.post("/produtos", (req, res) => {
    const { nome, preco, categoria } = req.body;
  
    if (!nome || preco == null) {
      return res.status(400).json({ erro: "Nome e preço são obrigatórios" });
    }
  
    if (typeof preco !== "number" || preco <= 0) {
      return res.status(400).json({ erro: "Preço deve ser um número positivo" });
    }
  
    const ultimoId = produtos.length > 0
      ? Math.max(...produtos.map(p => p.id))
      : 0;
  
    const novoProduto = {
      id: ultimoId + 1,
      nome,
      preco,
      categoria,
    };
  
    produtos.push(novoProduto);
  
    res.status(201).json(novoProduto);
  });
  
//DELETE - remover produto
app.delete("/produtos/:id", (req,res) => {
const id = parseInt(req.params.id);
const index = produtos.findIndex((p) => p.id === id);

if (index === -1){
    return res.status(404).json({erro : "Produto não encontrado"});
}

const removido = produtos.splice(index,1);
res.json({mensagem : "Produto removido" , produto : removido[0] });
})


// Iniciar Servidor
const PORT = process.env.PORT || 3000;
app.listen (PORT, () =>{
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

