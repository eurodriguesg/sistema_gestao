import { Router, Request, Response, RequestHandler } from 'express';
import { Library } from '../models/Library';
import { Book } from '../models/Book';

const router = Router();
const library = new Library();

// LISTAR TODOS OS LIVROS
router.get('/books', (req: Request, res: Response) => {
    const allBooks = library.getAllBooks();
    res.status(200).json(allBooks);
});

// Função de middleware para adicionar livro(s)
const addBooksHandler: RequestHandler = (req, res) => {
    try {
        // Verificar se o corpo da requisição é um array (múltiplos livros) ou um objeto (um único livro)
        const isArray = Array.isArray(req.body);

        if (isArray) {
            // Adicionar múltiplos livros
            const books = req.body;

            // Validar os campos obrigatórios para cada livro
            const isValid = books.every((book: any) => book.code && book.title && book.author && book.available !== undefined);

            if (!isValid) {
                res.status(400).json({ message: 'Todos os livros devem ter code, title, author e available.' });
                return;
            }

            // Converter o array para instâncias da classe Book
            const bookInstances = books.map((book: any) => new Book(
                Number(book.code),
                book.title,
                book.author,
                Boolean(book.available)
            ));

            // Adicionar livros usando o método addBooks
            const result = library.addBooks(bookInstances);

            res.status(200).json({
                message: 'Processamento concluído.',
                added: result.added,
                duplicates: result.duplicates
            });
            return;
        } else {
            // Adicionar um único livro
            const { code, title, author, available } = req.body;

            // Validação dos campos obrigatórios
            if (!code || !title || !author || available === undefined) {
                res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos: code, title, author, available' });
                return;
            }

            // Criar o livro e tentar adicioná-lo ao acervo
            const book = new Book(Number(code), title, author, Boolean(available));
            const added = library.addBook(book);

            if (added) {
                res.status(201).json({ message: 'Livro adicionado com sucesso!', book });
            } else {
                res.status(409).json({ message: `Livro com código ${book.code} já existe no acervo.` });
            }
            return;
        }
    } catch (error: any) {
        console.error(`[SRV-LIBRARY] Erro ao adicionar livro(s): ${error.message}`);
        res.status(500).json({ message: 'Erro interno do servidor.' });
        return;
    }
};

// Adicionar a função de middleware à rota POST
router.post('/books', addBooksHandler);

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
