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

// REGISTRAR EMPRÉSTIMO DE LIVRO
router.post('/books/:codigo/loan', (req, res) => {

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

// REGISTRAR DEVOLUÇÃO DE LIVRO
router.post('/books/:codigo/return', (req, res) => {
    
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

// CONSULTAR DISPONIBILIDADE DO LIVRO
router.post('/books/:codigo/isAvailable', (req, res) => {

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

// LISTAR LIVROS DISPONÍVEIS
router.get('/books/available', (req, res) => {
    const availableBooks = library.listAvailableBooks();
    res.status(200).send(availableBooks);
});

export default router;
