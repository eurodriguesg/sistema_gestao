import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import { Library } from './models/Library';
import { Book } from './models/Book';

const app = express();
const library = new Library();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

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
    console.log(`[SRV 🟡]Recebido pedido de empréstimo para o livro com código: ${codigo}`);
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

const PORT = process.env.PORT || 31063;
app.listen(PORT, () => {
    console.log(`[SRV ✅] 🖥️  Servidor .......: Operando na PT/${PORT}`);
});