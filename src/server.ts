import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import os from 'os';
import chalk from 'chalk';
import { Library } from './models/Library';
import { Book } from './models/Book';

// Configurações do servidor
const port = 31063;
const host = '0.0.0.0';

// Função para obter IPs locais
const getLocalIPs = (): string[] => {
    const interfaces = os.networkInterfaces();
    const ips: string[] = [];
    for (const iface of Object.values(interfaces)) {
        if (!iface) continue;
        for (const config of iface) {
            if (config.family === 'IPv4' && !config.internal) {
                ips.push(config.address);
            }
        }
    }
    return ips;
};

// Criando o app do Express
const app = express();
const library = new Library();

// Configurando middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve arquivos estáticos da pasta 'public'

// Definindo as rotas
app.get('/books', (req, res) => {
    const allBooks = library.getAllBooks();
    res.status(200).send(allBooks);
});

app.post('/books', (req, res) => {
    const { codigo, titulo, autor, disponivel } = req.body;
    const book = new Book(Number(codigo), titulo, autor, disponivel);
    const added = library.addBook(book);
    if (added) {
        res.status(201).send(book);
    } else {
        res.status(409).send({ message: `Livro com código ${book.codigo} já existe no acervo.` });
    }
});

app.post('/books/:codigo/loan', (req, res) => {
    const codigo = parseInt(req.params.codigo);
    console.log(`[SRV 🟡] Recebido pedido de empréstimo para o livro com código: ${codigo}`);
    const loaned = library.registerLoan(codigo);
    if (loaned === 'not_found') {
        res.status(404).send({ message: 'Livro não existe' });
    } else if (loaned === 'not_available') {
        res.status(409).send({ message: 'Livro não disponível para empréstimo' });
    } else if (loaned === 'success') {
        res.status(200).send({ message: 'Empréstimo registrado' });
    } else {
        res.status(500).send({ message: 'Erro desconhecido' });
    }
});

app.post('/books/:codigo/return', (req, res) => {
    const codigo = Number(req.params.codigo);
    library.registerReturn(codigo);
    res.status(200).send({ message: '[SRV ✅] Devolução registrada' });
});

app.get('/books/available', (req, res) => {
    const availableBooks = library.listAvailableBooks();
    res.status(200).send(availableBooks);
});

// Iniciando o servidor
app.listen(port, host, () => {
    console.log(chalk.greenBright('\n[SRV ✅] Servidor iniciado com sucesso!'));
    console.log(chalk.cyanBright('\nEndereços disponíveis:'));

    // Exibir URLs acessíveis
    console.log(chalk.yellowBright(`- Local:    http://127.0.0.1:${port}`));
    const localIPs = getLocalIPs();
    for (const ip of localIPs) {
        console.log(chalk.yellowBright(`- Rede:     http://${ip}:${port}`));
    }

    console.log(chalk.blueBright('\nPressione CTRL+C para parar o servidor.\n'));
});
