import { Book } from './Book';

export class Library {
    private acervo: Array<Book>;

    constructor() {
        this.acervo = new Array<Book>();
    }

    // Método para adicionar um livro ao acervo
    public addBook(book: Book): boolean {

        const exists = this.acervo.some(b => b.codigo === book.codigo);

        if (!exists) {
            this.acervo.push(book);
            console.log(`[SRV-LIBRARY ✅] Livro adicionado: ${book.codigo} - ${book.titulo} (${book.autor})`);
            //console.log('Acervo atual:', this.acervo);
            return true;
        } else {
            console.log(`[SRV-LIBRARY 🔴] Livro com código ${book.codigo} já existe no acervo`);
            return false;
        }
    }

    // Método para registrar um empréstimo de um livro
    public registerLoan(codigo: number): string {

        console.log(`[SRV-LIBRARY 🟡] Tentando registrar empréstimo para o livro com código: ${codigo}`);

        let book = this.acervo.find(book => book.codigo === codigo);
        if (!book) {
            console.log(`[SRV-LIBRARY 🔴] Livro com código ${codigo} não encontrado`);
            return 'not_found';
        }
        if (!book.disponivel) {
            console.log(`[SRV-LIBRARY 🔴] Livro não disponível para empréstimo`);
            return 'not_available';
        }

        book.disponivel = false;
        console.log(`[SRV-LIBRARY ✅] Empréstimo registrado para o livro: ${book.titulo}`);
        return 'success';
    }

    // Método para verificar se o livro está disponível
    public isBookAvailable(codigo: number): boolean {
        console.log(`[SRV-LIBRARY 🟡] Verificando disponibilidade para o livro com código: ${codigo}`);

        const book = this.acervo.find(book => book.codigo === codigo);
        if (!book) {
            console.log(`[SRV-LIBRARY 🔴] Livro com código ${codigo} não encontrado`);
            return false; // Caso o livro não seja encontrado, consideramos que ele não está disponível.
        }

        console.log(`[SRV-LIBRARY ✅] Livro com código ${codigo} está ${book.disponivel ? 'disponível' : 'indisponível'}`);
        return book.disponivel;
    }

    // Método para registrar a devolução de um livro
    public registerReturn(codigo: number): string {

        console.log(`[SRV-LIBRARY 🟡] Tentando registrar devolução para o livro com código: ${codigo}`);

        let book = this.acervo.find(book => book.codigo === codigo);
        if (!book) {
            console.log(`[SRV-LIBRARY 🔴] Livro com código ${codigo} não encontrado`);
            return 'not_found';
        }
        else if (book.disponivel) {
            console.log(`[SRV-LIBRARY 🔴] Livro já devolvido`);
            return 'not_available';
        }

        book.disponivel = true;
        console.log(`[SRV-LIBRARY ✅] Devolução registrada para o livro: ${book.titulo}`);
        return 'success';
    }

    // Método para retornar todos os livros disponíveis
    public listAvailableBooks(): Array<Book> {
        return this.acervo.filter(book => book.disponivel);
    }

    // Método para retornar todos os livros do acervo
    public getAllBooks(): Array<Book> {
        return this.acervo;
    }
    
}