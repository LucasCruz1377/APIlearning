const express = require("express");
const { profileEnd } = require("node:console");
const { copyFileSync } = require("node:fs");
const app = express();

app.use(express.json());

// Criar lista de produtos

let produtos =  [
    {id: 1 , nome : "Notebook", preco : 2500, categoria : "informatica"},
    {id: 2 , nome : "Mouse", preco : 50, categoria : "informatica"},
    {id: 3 , nome : "PS4", preco : 2500, categoria : "informatica"},
    {id: 4 , nome : "Monitor", preco : 2500, categoria : "informatica"},
    {id: 5 , nome : "PS4", preco : 2500, categoria : "informatica"},
];

let funcionarios = [
    {id: 1 , nome : "Tiago Augusto", salario: 1600 , idade : 18 , setor : "botanico"},
    {id: 2 , nome : "Carlos Eduardo", salario: 1600 , idade : 17 , setor : "nutricionista esportivo"},
    {id: 3 , nome : "Tamires Alves", salario: 1600 , idade : 17 , setor : "producao"},
    {id: 4 , nome : "Lucas Cruz", salario: 1600 , idade : 17 , setor : "desenvolvimento"},
]

// GET - mensagem de boas vindas
app.get("/", (req,res) =>
{
    res.json({ mensagem : "Bem vindo a minha API!"});
});

//GET - listar funcionarios

app.get("/funcionarios",(req,res) =>{

    return res.json(funcionarios)
})

app.get("/funcionarios/:id", (req,res) => {
    const id = parseInt(req.params.id);
    const funcionario = funcionarios.find((p) => p.id === id)

    if (!funcionario){
        return res.status(404).json({ erro : "Funcionario não encontrado"});
    }

    res.json(funcionario)
})

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

//POST - criar novo produto
app.post("/produtos", (req,res) => 
{
    const {nome , preco} = req.body;
    // Validaçoes

    if (!nome || !preco){
        return res.status(400).json({ erro : "Nome e preço são obrigatorios"});
    }
    const ultimoId = produtos.length > 0 ? produtos[produtos.length - 1].id : 0;
    const novoProduto = {
        id : ultimoId + 1,
        nome,
        preco,
    };
    produtos.push(novoProduto);
    res.status(201).json(novoProduto);
})


// Iniciar Servidor
const PORT = process.env.PORT || 3000;
app.listen (PORT, () =>{
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

