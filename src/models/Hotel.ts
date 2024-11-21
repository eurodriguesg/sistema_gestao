import { Booking } from './Booking';

export class Hotel {

    private bookings: Array<Booking>;

    constructor() {
        this.bookings = new Array<Booking>();
    }

    // Método para obter todas as reservas registradas
    getAllBookings(): Booking[] {
        return this.bookings;
    }
    
    // Método para registrar uma única reserva
    makeBooking(booking: Booking): boolean {
        // Verifica se há conflito para a reserva
        const conflito = this.bookings.some(r =>
            r.numberFour === booking.numberFour &&
            ((booking.entryDate >= r.entryDate && booking.entryDate <= r.dateExit) ||
                (booking.dateExit >= r.entryDate && booking.dateExit <= r.dateExit) ||
                (booking.entryDate <= r.entryDate && booking.dateExit >= r.dateExit))
        );

        if (conflito) {
            console.log(`[SRV-HOTEL 🔴] Quarto com reserva para.: ${booking.numberFour} - ${booking.guestName} (${booking.entryDate}/${booking.dateExit})`);
            return false; // Retorna false se houver conflito
        }

        // Se não houver conflito, adiciona a reserva
        this.bookings.push(booking);
        console.log(`[SRV-HOTEL ✅] Reserva realizada para..: ${booking.numberFour} - ${booking.guestName} (${booking.entryDate}/${booking.dateExit})`);
        return true; // Retorna true se a reserva foi confirmada com sucesso
    }

    // Método para registrar várias reservas
    makeBookings(bookings: Booking[]): boolean {
        const bookingsWithConflict: string[] = [];
        const confirmedBookings: string[] = [];
    
        for (const booking of bookings) {
            // Verifica conflitos com as reservas existentes
            const conflito = this.bookings.some(r =>
                r.numberFour === booking.numberFour &&
                ((booking.entryDate >= r.entryDate && booking.entryDate <= r.dateExit) ||
                 (booking.dateExit >= r.entryDate && booking.dateExit <= r.dateExit) ||
                 (booking.entryDate <= r.entryDate && booking.dateExit >= r.dateExit))
            );
    
            if (conflito) {
                bookingsWithConflict.push(`Quarto ${booking.numberFour} de ${booking.guestName}`);
            } else {
                this.bookings.push(booking);
                confirmedBookings.push(`Quarto ${booking.numberFour} de ${booking.guestName}`);
            }
        }
    
        if (bookingsWithConflict.length > 0) {
            console.log(`[SRV-HOTEL 🔴] Conflitos nas reservas: ${bookingsWithConflict.join(', ')}`);
            return false;
        }
    
        console.log(`[SRV-HOTEL ✅] Reservas confirmadas: ${confirmedBookings.join(', ')}`);
        return true;
    }    

    // Método para onsultar disponibilidade para um período
    checkRoomAvailability(numberFour: number, entryDate: Date, dateExit: Date): { status: string, details?: any } {
        //console.log("====== Início da comparação de datas ======");
        //console.log("Entrada solicitada:", entryDate.toISOString());
        //console.log("Saída solicitada:", dateExit.toISOString());
    
        const conflict = this.bookings.some(booking => {
            //console.log("Reserva existente - Entrada:", booking.entryDate.toISOString(), "Saída:", booking.dateExit.toISOString());
    
            return booking.numberFour === numberFour &&
                // Qualquer sobreposição de intervalos
                !(
                    dateExit <= booking.entryDate || // Saída antes do início da reserva existente
                    entryDate >= booking.dateExit   // Entrada após o fim da reserva existente
                );
        });
    
        //console.log("====== Fim da comparação de datas ======");
    
        if (conflict) {
            console.log(`Quarto ${numberFour} está reservado para o período solicitado.`);
            return { status: 'not_available' };
        }
    
        console.log(`Quarto ${numberFour} está disponível para o período solicitado.`);
        return { status: 'success' };
    }
    
    
    // Método para cancelar uma reserva com base no número do quarto
    cancelBooking(bookingId: string): boolean {
        const index = this.bookings.findIndex(booking => booking.id === bookingId);
    
        if (index !== -1) {
            const removedBooking = this.bookings.splice(index, 1)[0];
            console.log(`[SRV-HOTEL ✅] Reserva cancelada: Quarto ${removedBooking.numberFour}, Hóspede ${removedBooking.guestName}.`);
            return true;
        }
    
        console.log(`[SRV-HOTEL 🔴] Reserva não encontrada com o ID: ${bookingId}`);
        return false;
    }    

    // Método para listar todas as reservas disponíveis (não ocupadas hoje)
    listAvailableBookings(): Booking[] {
        const today = new Date();
        return this.bookings.filter(booking => today < booking.entryDate || today > booking.dateExit);
    }
}