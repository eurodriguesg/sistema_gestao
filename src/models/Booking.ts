export class Booking {
    
    numberFour: number;
    guestName: string;
    entryDate: Date;
    dateExit: Date;

    constructor(numberFour: number, guestName: string, entryDate: Date, dateExit: Date) {
    
        this.numberFour = numberFour;
        this.guestName  = guestName;
        this.entryDate  = entryDate;
        this.dateExit   = dateExit;
    }
}
