import { Request, Response } from 'express';
import { Library }           from '../models/Library';
import { Book }              from '../models/Book';

const library = new Library();

export const LibraryController = {
    
    // LISTAR LIVROS DO ACERVO
    getAllBooks: ( req: Request, res: Response): void => {
        const allBooks = library.getAllBooks();

        if (allBooks) {
            res.status(200).json({ message: 'Livros do Acervo:', allBooks: allBooks});
        } else {
            res.status(409).json({ message: 'Acervo vazio' });
        }
    },

    // ADICIONAR LIVROS
    addBooks: (req: Request, res: Response): void => {
        try {
            const isArray = Array.isArray(req.body);

            if (isArray) {
                const books = req.body;

                const isValid = books.every(
                    (book: any) => book.code && book.title && book.author !== undefined
                );

                if (!isValid) {
                    res.status(400).json({ message: 'Todos os livros devem ter code, title, author' });
                    return;
                }

                const bookInstances = books.map(
                    (book: any) => new Book(Number(book.code), book.title, book.author, Boolean(book.available))
                );

                const result = library.addBooks(bookInstances);

                res.status(200).json({
                    message: 'Livros adicionados com sucesso',
                    added: result.added,
                    duplicates: result.duplicates,
                });
                return;
            } else {
                const { code, title, author, available } = req.body;

                if (!code || !title || !author === undefined) {
                    res.status(400).json({
                        message: 'Todos os campos obrigatórios devem ser preenchidos: code, title, author',
                    });
                    return;
                }

                const book = new Book(Number(code), title, author, Boolean(available));
                const added = library.addBook(book);

                if (added) {
                    res.status(201).json({ message: 'Livro adicionado com sucesso', book: `${book.code} - ${book.title} (${book.author})`});
                } else {
                    res.status(409).json({ message: 'Livro já existe', book: `${book.code} - ${book.title} (${book.author})`});
                }
                return;
            }
        } catch (error: any) {
            console.error(`[SRV-LIBRARY] Erro ao adicionar livro(s): ${error.message}`);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    },

    // REGISTRAR EMPRÉSTIMO DE LIVRO
    registerLoan: (req: Request, res: Response): void => {
        const code = parseInt(req.params.code);

        if (isNaN(code)) {
            res.status(400).json({ message: 'Código inválido' });
            return;
        }

        const loaned = library.registerLoan(code);

        if (loaned === 'not_found') {
            res.status(404).json({ message: 'Livro não encontrado', code: code});
        } else if (loaned === 'not_available') {
            res.status(409).json({ message: 'Livro não disponível', code: code});
        } else if (loaned === 'success') {
            res.status(200).json({ message: 'Empréstimo registrado', code: code});
        } else {
            res.status(500).json({ message: 'Erro desconhecido' });
        }
    },

    // REGISTRAR DEVOLUÇÃO DE LIVROS
    registerReturn: (req: Request, res: Response): void => {
        const code = parseInt(req.params.code);

        if (isNaN(code)) {
            res.status(400).json({ message: 'Código inválido.' });
            return;
        }

        const result = library.registerReturn(code);

        if (result === 'not_found') {
            res.status(404).json({ message: 'Livro não encontrado', code: code});
        } else if (result === 'not_available') {
            res.status(409).json({ message: 'Livro já devolvido', code: code});
        } else if (result === 'success') {
            res.status(200).json({ message: 'Devolução registrada', code: code});
        } else {
            res.status(500).json({ message: 'Erro desconhecido' });
        }
    },

    // CONSULTAR DISPONIBILIDADE DE LIVRO
    checkAvailability: (req: Request, res: Response): void => {
        const code = parseInt(req.params.code);

        if (isNaN(code)) {
            res.status(400).json({ message: 'Código inválido.' });
            return;
        }

        const isAvailable = library.checkAvailability(code);

        if (isAvailable) {
            res.status(200).json({ message: 'Livro disponível', code: code});
        } else {
            res.status(409).json({ message: 'Livro não disponível', code: code});
        }
    },

    searchBook: (req: Request, res: Response): void => {
        
        const code = parseInt(req.params.code);

        if (isNaN(code)) {
            res.status(400).json({ message: 'Código inválido.' });
            return;
        }

        const book = library.searchBook(code);

        if (book.book != null) {
            res.status(200).json({ message: 'Livro encontrado.', book: book.book});
        } else {
            res.status(404).json({ message: 'Livro não encontrado.' });
        }
    },

    listAvailableBooks: (_req: Request, res: Response): void => {

        const availableBooks = library.listAvailableBooks();

        if (availableBooks != null) {
            res.status(200).json({ message: 'Livro(s) encontrado(s).', books: availableBooks});
        } else {
            res.status(409).json({ message: 'Livro(s) não encontrados.' });
        }
    },
};
