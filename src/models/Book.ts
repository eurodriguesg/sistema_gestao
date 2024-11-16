export class Book {
    code: number;
    title: string;
    author: string;
    available: boolean;

    constructor(code: number, title: string, author: string, available: boolean) {
    
        this.code = code;
        this.title = title;
        this.author  = author;
        this.available = available;
    }
}
