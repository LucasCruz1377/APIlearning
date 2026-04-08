const express = require("express");
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensagem: "Bem-vindo ao servidor! 🚀" });
});


app.get("/produtos", async (req, res) => {
  try {
    const categoria = req.query.categoria;

    let query = supabase.from("produtos").select("*");

    if (categoria) {
      query = query.eq("categoria", categoria);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});
app.get("/produtos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const { data, error } = await supabase
      .from("produtos")
      .select("*")
      .eq("id", id)
      .single()

    if (error && error.code === "PGRST116") {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});
app.post("/produtos", async (req, res) => {
  try {
    const { nome, preco, categoria } = req.body;

    if (!nome || !preco) {
      return res
        .status(400) 
        .json({ erro: "Nome e preço são obrigatórios" });
    }

    const { data, error } = await supabase
      .from("produtos")
      .insert([{ nome, preco, categoria }]) // insere o novo produto
      .select()                             // retorna o que foi inserido
      .single();

    if (error) throw error;

    // 201 = Created (recurso criado com sucesso)
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// ----------------------------------------------------------
// PUT /produtos/:id — Atualizar produto existente
// ----------------------------------------------------------
//
//  PUT substitui os dados do produto inteiro.
//  Diferença entre PUT e PATCH:
//  - PUT   → envia TODOS os campos (substitui tudo)
//  - PATCH → envia só os campos que mudaram (atualização parcial)
//
//  .update(objeto) atualiza o registro que corresponder ao filtro

app.put("/produtos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nome, preco, categoria } = req.body;

    if (!nome || !preco) {
      return res.status(400).json({ erro: "Nome e preço são obrigatórios" });
    }

    const { data, error } = await supabase
      .from("produtos")
      .update({ nome, preco, categoria }) // o que atualizar
      .eq("id", id)                       // WHERE id = :id
      .select()
      .single();

    if (error && error.code === "PGRST116") {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// ----------------------------------------------------------
// DELETE /produtos/:id — Remover produto
// ----------------------------------------------------------
//
//  .delete() remove o registro que corresponder ao filtro
//  ⚠️ Sempre use um filtro (.eq) antes de deletar!
//     Sem filtro, o Supabase pode deletar TUDO na tabela.

app.delete("/produtos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const { data, error } = await supabase
      .from("produtos")
      .delete()
      .eq("id", id) // WHERE id = :id
      .select()     // retorna o que foi deletado
      .single();

    if (error && error.code === "PGRST116") {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    if (error) throw error;

    res.json({ mensagem: "Produto removido com sucesso", produto: data });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// ----------------------------------------------------------
// 5. INICIAR SERVIDOR
// ----------------------------------------------------------
//
//  process.env.PORT → variável de ambiente (útil em produção)
//  || 3000          → valor padrão se a variável não existir

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📦 Banco de dados: Supabase`);
  console.log(`\nRotas disponíveis:`);
  console.log(`  GET    /produtos`);
  console.log(`  GET    /produtos/:id`);
  console.log(`  POST   /produtos`);
  console.log(`  PUT    /produtos/:id`);
  console.log(`  DELETE /produtos/:id\n`);
});