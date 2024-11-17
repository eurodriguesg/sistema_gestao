import { Book } from './Book';

export class Library {

    private collection: Array<Book>;

    constructor() {
        this.collection = new Array<Book>();
    }

    // Método para adicionar um livro ao acervo
    public addBook(book: Book): boolean {

        const exists = this.collection.some(b => b.code === book.code);

        if (!exists) {
            this.collection.push(book);
            console.log(`[SRV-LIBRARY ✅] Livro adicionado: ${book.code} - ${book.title} (${book.author})`);
            //console.log('Acervo atual:', this.collection);
            return true;
        } else {
            console.log(`[SRV-LIBRARY 🔴] Livro com código ${book.code} já existe no acervo`);
            return false;
        }
    }

    // Método para registrar um empréstimo de um livro
    public registerLoan(code: number): string {

        console.log(`[SRV-LIBRARY 🟡] Tentando registrar empréstimo para o livro com código: ${code}`);

        let book = this.collection.find(book => book.code === code);
        if (!book) {
            console.log(`[SRV-LIBRARY 🔴] Livro com código ${code} não encontrado`);
            return 'not_found';
        }
        if (!book.available) {
            console.log(`[SRV-LIBRARY 🔴] Livro não disponível para empréstimo`);
            return 'not_available';
        }

        book.available = false;
        console.log(`[SRV-LIBRARY ✅] Empréstimo registrado para o livro: ${book.title}`);
        return 'success';
    }

    // Método para verificar se o livro está disponível
    public isBookAvailable(code: number): boolean {
        console.log(`[SRV-LIBRARY 🟡] Verificando disponibilidade para o livro com código: ${code}`);

        const book = this.collection.find(book => book.code === code);
        if (!book) {
            console.log(`[SRV-LIBRARY 🔴] Livro com código ${code} não encontrado`);
            return false; // Caso o livro não seja encontrado, consideramos que ele não está disponível.
        }

        console.log(`[SRV-LIBRARY ✅] Livro com código ${code} está ${book.available ? 'disponível' : 'indisponível'}`);
        return book.available;
    }

    // Método para registrar a devolução de um livro
    public registerReturn(code: number): string {

        console.log(`[SRV-LIBRARY 🟡] Tentando registrar devolução para o livro com código: ${code}`);

        let book = this.collection.find(book => book.code === code);
        if (!book) {
            console.log(`[SRV-LIBRARY 🔴] Livro com código ${code} não encontrado`);
            return 'not_found';
        }
        else if (book.available) {
            console.log(`[SRV-LIBRARY 🔴] Livro já devolvido`);
            return 'not_available';
        }

        book.available = true;
        console.log(`[SRV-LIBRARY ✅] Devolução registrada para o livro: ${book.title}`);
        return 'success';
    }

    // Método para retornar todos os livros disponíveis
    public listAvailableBooks(): Array<Book> {
        return this.collection.filter(book => book.available);
    }

    // Método para retornar todos os livros do acervo
    public getAllBooks(): Array<Book> {
        return this.collection;
    }
    
}