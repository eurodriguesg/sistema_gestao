export class Booking {
    id: string; // Identificador único de 5 caracteres
    numberFour: number; // Número do quarto
    guestName: string; // Nome do hóspede
    entryDate: Date; // Data de entrada
    dateExit: Date; // Data de saída

    constructor(numberFour: number, guestName: string, entryDate: Date, dateExit: Date) {
        this.id = generateUniqueId(); // Gera um ID alfanumérico curto
        this.numberFour = numberFour;
        this.guestName = guestName;
        this.entryDate = entryDate;
        this.dateExit = dateExit;
    }
}

// Função para gerar um ID alfanumérico de 5 caracteres
function generateUniqueId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Conjunto de caracteres
    let result = '';
    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    return result;
}
    

