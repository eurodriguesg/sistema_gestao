import { Book } from './Book';

export class Library {

    private collection: Array<Book>;

    constructor() {
        this.collection = new Array<Book>();
    }

    // Método para retornar todos os livros do acervo
    public getAllBooks(): Array<Book> {

        let added =0;
        
        this.collection.forEach(book => {
            added++;
        });
        
        if(added > 0) {
            console.log(`[SRV-LIBRARY ✅] Livros do acervo ....: ${added} Livros`);
            return this.collection; // Retorna o livro encontrado.
        } else {
            console.log(`[SRV-LIBRARY 🔴] Acervo vazio`);
            return [];
        }
    }

    // Método para adicionar um livro ao acervo
    public addBook(book: Book): boolean {
        const exists = this.collection.some(b => b.code === book.code);

        if (!exists) {
            // Garante que o livro será adicionado como disponível
            book.available = true;

            this.collection.push(book);
            console.log(`[SRV-LIBRARY ✅] Livro adicionado.....: ${book.code} - ${book.title} (${book.author})`);
            return true;
        } else {
            console.log(`[SRV-LIBRARY 🔴] Livro já existe......: ${book.code} - ${book.title} (${book.author})`);
            return false;
        }
    }  

    // Método para adicionar múltiplos livros ao acervo
    public addBooks(books: Book[]): { added: number; duplicates: number } {
        let added = 0;
        let duplicates = 0;

        books.forEach(book => {
            const success = this.addBook(book);
            if (success) {
                added++;
            } else {
                duplicates++;
            }
        });
        
        console.log(`[SRV-LIBRARY ✅] Livros adicionados...: Novos(${added}), Duplicados(${duplicates})`);
        return { added, duplicates };
    }

    // Método para registrar empréstimo de um livro
    public registerLoan(code: number): string {

        // console.log(`[SRV-LIBRARY 🟡] Tentando registrar empréstimo para o livro com código: ${code}`);
        let book = this.collection.find(book => book.code === code);

        if (!book) {
            console.log(`[SRV-LIBRARY 🔴] Livro não encontrado.: ${code} `);
            return 'not_found';
        }
        if (!book.available) {
            console.log(`[SRV-LIBRARY 🔴] Livro não disponível.: ${book.code} - ${book.title} (${book.author})`);
            return 'not_available';
        }

        book.available = false;
        console.log(`[SRV-LIBRARY ✅] Empréstimo registrado: ${book.code} - ${book.title} (${book.author})`);
        return 'success';
    }

    // Método para registrar a devolução de um livro
    public registerReturn(code: number): string {

        // console.log(`[SRV-LIBRARY 🟡] Tentando registrar devolução para o livro com código: ${code}`);
        let book = this.collection.find(book => book.code === code);
        
        if (!book) {
            console.log(`[SRV-LIBRARY 🔴] Livro não encontrado.: ${code} `);
            return 'not_found';
        }
        else if (book.available) {
            console.log(`[SRV-LIBRARY 🔴] Livro já devolvido...: ${book.code} - ${book.title} (${book.author})`);
            return 'not_available';
        }

        book.available = true;
        console.log(`[SRV-LIBRARY ✅] Devolução registrada.: ${book.code} - ${book.title} (${book.author})`);
        return 'success';
    }

    // Método para verificar se o livro está disponível
    public checkAvailability(code: number): boolean {
        
        // console.log(`[SRV-LIBRARY 🟡] Verificando disponibilidade para o livro com código: ${code}`);
        const book = this.collection.find(book => book.code === code);

        if (!book) {
            console.log(`[SRV-LIBRARY 🔴] Livro não encontrado.: ${code} `);
            return false; // Caso o livro não seja encontrado, consideramos que ele não está disponível.
        }

        console.log(`[SRV-LIBRARY ✅] Status do livro......: ${book.code} - ${book.title} (${book.author}) [${book.available ? 'disponível' : 'indisponível'}]`);
        return book.available;
    }

    // Método para verificar se o livro está disponível
    public searchBook(code: number): { book: Book | null } {
        //console.log(`[SRV-LIBRARY 🟡] Buscando o livro com código: ${code}`);
    
        const book = this.collection.find(book => book.code === code);
        if (!book) {
            console.log(`[SRV-LIBRARY 🔴] Livro não encontrado.: ${code} `);
            return { book: null }; // Retorna null no atributo book se não encontrado.
        }
    
        console.log(`[SRV-LIBRARY ✅] Livro encontrado.....: ${JSON.stringify(book)}`);
        return { book }; // Retorna o livro encontrado.
    }    

    // Método para retornar todos os livros disponíveis
    public listAvailableBooks(): Array<Book> {
        
        const availableBooks = this.collection.filter(book => book.available)
        
        console.log(`[SRV-LIBRARY ✅] Livro(s) encontrados.: ${JSON.stringify(availableBooks)}`);
        return availableBooks;
    }
    
}