import path from 'path';
import bodyParser from 'body-parser';
import os from 'os';
import chalk from 'chalk';
import { Library } from './models/Library';
import { Book } from './models/Book';
import express, { Request, Response } from 'express';

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
    res.status(200).json(allBooks); // Certifique-se de usar .json()
});

app.post('/books', (req, res) => {
    try {
        const { codigo, titulo, autor, disponivel } = req.body;

        if (!codigo) {
            throw new Error('Campo obrigatório deve ser preenchidos: código');
        }
        if (!titulo) {
            throw new Error('Campo obrigatório deve ser preenchidos: Título');
        }
        if (!autor) {
            throw new Error('Campo obrigatório deve ser preenchidos: Autor');
        }
        if (!disponivel) {
            throw new Error('Campo obrigatório deve ser preenchidos: Disponivel');
        }

        // Criar o livro e tentar adicioná-lo ao acervo
        const book = new Book(Number(codigo), titulo, autor, Boolean(disponivel));
        const added = library.addBook(book);

        if (added) {
            res.status(201).send(book);
        } else {
            res.status(409).send({ message: `Livro com código ${book.codigo} já existe no acervo.` });
        }
    } catch (error: any) {
        res.status(400).send({ message: error.message });
    }
});

app.post('/books/:codigo/loan', (req, res) => {

    const codigo = parseInt(req.params.codigo);
    // console.log(`[SRV 🟡] Recebido pedido de empréstimo para o livro com código: ${codigo}`);

    if (!codigo) {
        throw new Error('Campo obrigatório deve ser preenchidos: código');
    }
    
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
    
    const codigo = parseInt(req.params.codigo);
    // console.log(`[SRV 🟡] Recebido pedido de devolução para o livro com código: ${codigo}`);

    if (!codigo) {
        throw new Error('Campo obrigatório deve ser preenchidos: código');
    }

    const returnb = library.registerReturn(codigo);
    // console.log(returnb)

    if (returnb === 'not_found') {
        res.status(404).send({ message: 'Livro não existe' });
    } else if (returnb === 'not_available') {
        res.status(409).send({ message: 'Livro já devolvido' });
    } else if (returnb === 'success') {
        res.status(200).send({ message: 'Devolução registrada' });
    } else {
        res.status(500).send({ message: 'Erro desconhecido' });
    }
    
});

app.post('/books/:codigo/isAvailable', (req, res) => {

    const codigo = parseInt(req.params.codigo);
    // console.log(`[SRV 🟡] Recebido pedido de devolução para o livro com código: ${codigo}`);

    if (!codigo) {
        throw new Error('Campo obrigatório deve ser preenchidos: código');
    }

    const availableBooks = library.isBookAvailable(codigo);
    // console.log(availableBooks)

    if (availableBooks) {
        res.status(200).send({ message: 'Livro disponível' });
    } else if (!availableBooks) {
        res.status(409).send({ message: 'Livro não disponível' });
    } else {
        res.status(500).send({ message: 'Erro desconhecido' });
    }
    
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
