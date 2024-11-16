import { Router } from 'express';
import { Library } from '../models/Library';
import { Book } from '../models/Book';

const router = Router();
const library = new Library();

// LISTAR TODOS OS LIVROS
router.get('/books', (req, res) => {
    const allBooks = library.getAllBooks();
    res.status(200).json(allBooks); // Certifique-se de usar .json()
});

// ADICIONAR LIVROS
router.post('/books', (req, res) => {
    try {
        const { code, title, author, available } = req.body;

        if (!code) {
            throw new Error('Campo obrigatório deve ser preenchidos: código');
        }
        if (!title) {
            throw new Error('Campo obrigatório deve ser preenchidos: Título');
        }
        if (!author) {
            throw new Error('Campo obrigatório deve ser preenchidos: Autor');
        }
        if (!available) {
            throw new Error('Campo obrigatório deve ser preenchidos: Disponível');
        }

        // Criar o livro e tentar adicioná-lo ao acervo
        const book = new Book(Number(code), title, author, Boolean(available));
        const added = library.addBook(book);

        if (added) {
            res.status(201).send(book);
        } else {
            res.status(409).send({ message: `Livro com código ${book.code} já existe no acervo.` });
        }
    } catch (error: any) {
        res.status(400).send({ message: error.message });
    }
});

// REGISTRAR EMPRÉSTIMO DE LIVRO
router.post('/books/:code/loan', (req, res) => {

    const code = parseInt(req.params.code);
    // console.log(`[SRV 🟡] Recebido pedido de empréstimo para o livro com código: ${code}`);

    if (!code) {
        throw new Error('Campo obrigatório deve ser preenchidos: código');
    }
    
    const loaned = library.registerLoan(code);

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

// REGISTRAR DEVOLUÇÃO DE LIVRO
router.post('/books/:code/return', (req, res) => {
    
    const code = parseInt(req.params.code);
    // console.log(`[SRV 🟡] Recebido pedido de devolução para o livro com código: ${code}`);

    if (!code) {
        throw new Error('Campo obrigatório deve ser preenchidos: código');
    }

    const returnb = library.registerReturn(code);
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

// CONSULTAR DISPONIBILIDADE DO LIVRO
router.post('/books/:code/isAvailable', (req, res) => {

    const code = parseInt(req.params.code);
    // console.log(`[SRV 🟡] Recebido pedido de devolução para o livro com código: ${code}`);

    if (!code) {
        throw new Error('Campo obrigatório deve ser preenchidos: código');
    }

    const availableBooks = library.isBookAvailable(code);
    // console.log(availableBooks)

    if (availableBooks) {
        res.status(200).send({ message: 'Livro disponível' });
    } else if (!availableBooks) {
        res.status(409).send({ message: 'Livro não disponível' });
    } else {
        res.status(500).send({ message: 'Erro desconhecido' });
    }
    
});

// LISTAR LIVROS DISPONÍVEIS
router.get('/books/available', (req, res) => {
    const availableBooks = library.listAvailableBooks();
    res.status(200).send(availableBooks);
});

export default router;
