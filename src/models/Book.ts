export class Book {
    codigo: number;
    titulo: string;
    autor: string;
    disponivel: boolean;

    constructor(codigo: number, titulo: string, autor: string, disponivel: boolean) {
    
        this.codigo = codigo;
        this.titulo = titulo;
        this.autor  = autor;
        this.disponivel = disponivel;
    }
}
