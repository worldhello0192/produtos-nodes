const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const port = 3000;

const produtosPath = path.join(__dirname, 'produtos.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let produtosData = fs.readFileSync(produtosPath, 'utf-8');
let produtos = JSON.parse(produtosData);

function salvarDados() {
    fs.writeFileSync(produtosPath, JSON.stringify(produtos, null, 2));
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/adicionar-produto', (req, res) => {
    res.sendFile(path.join(__dirname, 'adicionarproduto.html'));
});

app.post('/adicionar-produto', (req, res) => {
    const novoProduto = req.body;

    if (produtos.find(produto => produto.nome.toLowerCase() === novoProduto.nome.toLowerCase())) {
        res.send('<h1>Produto já em estoque.</h1>');
        return;
    }

    produtos.push(novoProduto);
    salvarDados();
    res.send('<h1>Produto adicionado com sucesso!</h1>');
});

app.get('/atualizar-produto', (req, res) => {
    res.sendFile(path.join(__dirname, 'atualizarproduto.html'));
});

app.post('/atualizar-produto', (req, res) => {
    const { nome, novaDescricao } = req.body;

    let produtosDataAtual = fs.readFileSync(produtosPath, 'utf-8');
    let produtosAtual = JSON.parse(produtosDataAtual);

    const produtoIndex = produtosAtual.findIndex(produto => produto.nome.toLowerCase() === nome.toLowerCase());

    if (produtoIndex === -1) {
        res.send('<h1>Produto não encontrado.</h1>');
        return;
    }

    produtosAtual[produtoIndex].desc = novaDescricao;
    produtos = produtosAtual;
    salvarDados();
    res.send('<h1>Dados do produto atualizados com sucesso!</h1>');
});

app.get('/retirar-produto', (req, res) => {
    res.sendFile(path.join(__dirname, 'retirarproduto.html'));
});

app.post('/retirar-produto', (req, res) => {
    const { nome } = req.body;

    let produtosDataAtual = fs.readFileSync(produtosPath, 'utf-8');
    let produtosAtual = JSON.parse(produtosDataAtual);

    const produtoIndex = produtosAtual.findIndex(produto => produto.nome.toLowerCase() === nome.toLowerCase());

    if (produtoIndex === -1) {
        res.send('<h1>Produto não encontrado.</h1>');
        return;
    }

    produtosAtual.splice(produtoIndex, 1);
    produtos = produtosAtual;
    salvarDados();
    res.send(`<h1>O produto: ${nome} foi retirado com sucesso!</h1>`);
});

app.get('/encontrar-produto', (req, res) => {
    res.sendFile(path.join(__dirname, 'encontrarproduto.html'));
});

app.post('/encontrar-produto', (req, res) => {
    const { nome } = req.body;

    let produtosDataAtual = fs.readFileSync(produtosPath, 'utf-8');
    let produtosAtual = JSON.parse(produtosDataAtual);

    const produtoEncontrado = produtosAtual.find(produto => produto.nome.toLowerCase() === nome.toLowerCase());

    if (produtoEncontrado) {
        res.send(`
            <h1>Produto Encontrado!</h1>
            <p><strong>Nome:</strong> ${produtoEncontrado.nome}</p>
            <p><strong>Descrição:</strong> ${produtoEncontrado.desc || 'N/A'}</p>
            <p><strong>Validade:</strong> ${produtoEncontrado.url_validade || 'N/A'}</p>
            <br>
            <a href="/">Voltar à Página Inicial</a>
        `);
    } else {
        res.send(`
            <h1>Produto Não Encontrado</h1>
            <p>Nenhum produto com o nome "${nome}" foi encontrado.</p>
            <br>
            <a href="/">Voltar à Página Inicial</a>
        `);
    }
});

// Rota GET para exibir a página "Ver todos os Produtos" (Esta é a rota para "ver lista")
app.get('/ver-produto', (req, res) => {
    res.sendFile(path.join(__dirname, 'verprodutos.html'));
});

// Rota de API para retornar todos os produtos como JSON (usada pelo verprodutos.html)
app.get('/api/produtos', (req, res) => {
    let produtosDataAtual = fs.readFileSync(produtosPath, 'utf-8');
    let produtosAtual = JSON.parse(produtosDataAtual);
    res.json(produtosAtual);
});

app.listen(port, () => {
    console.log(`Servidor Iniciado em http://localhost:${port}`);
});
