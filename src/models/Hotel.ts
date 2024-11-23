import { Booking } from './Booking';

export class Hotel {

    private bookings: Array<Booking>;

    constructor() {
        this.bookings = new Array<Booking>();
    }

    // Método para ajustar a data ignorando o fuso horário
    formatDate(date: Date): string {
        return date.toISOString().split('T')[0].split('-').reverse().join('/'); // Retorna no formato dd/mm/aaaa
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
            (
                (booking.entryDate >= r.entryDate && booking.entryDate <= r.dateExit) ||
                (booking.dateExit  >= r.entryDate && booking.dateExit  <= r.dateExit) ||
                (booking.entryDate <= r.entryDate && booking.dateExit  >= r.dateExit)
            )
        );

        // Formatar as datas para exibição no log
        const formattedEntryDate = this.formatDate(booking.entryDate);
        const formattedDateExit  = this.formatDate(booking.dateExit);

        if (conflito) {
            console.log(
                "[SRV-HOTEL 🔴] Reservado para........: Quarto", booking.numberFour,
                "-", booking.guestName,
                "(", formattedEntryDate,
                ">", formattedDateExit,
                ")"
            );
            return false; // Retorna false se houver conflito
        }

        // Se não houver conflito, adiciona a reserva
        this.bookings.push(booking);
        console.log("[SRV-HOTEL ✅] Reserva confirmada....: Quarto", booking.numberFour,
            "-", booking.guestName,
            "(", formattedEntryDate,
            ">", formattedDateExit,
            ")"
        );
        return true; // Retorna true se a reserva foi confirmada com sucesso
    }

    // Método para registrar várias reservas
    makeBookings(bookings: Booking[]): boolean {
        let hasConflict = false;
        let added = 0;
        let duplicates = 0;
        
        for (const booking of bookings) {
            // Verifica conflitos com as reservas existentes
            const conflito = this.bookings.some(r =>
                r.numberFour === booking.numberFour &&
                (
                    (booking.entryDate >= r.entryDate && booking.entryDate <= r.dateExit) ||
                    (booking.dateExit >= r.entryDate && booking.dateExit <= r.dateExit) ||
                    (booking.entryDate <= r.entryDate && booking.dateExit >= r.dateExit)
                )
            );

            const formattedEntryDate = this.formatDate(booking.entryDate);
            const formattedDateExit  = this.formatDate(booking.dateExit);

            if (conflito) {
                console.log("[SRV-HOTEL 🔴] Conflito na reserva...: Quarto", booking.numberFour,
                    "-", booking.guestName,
                    "(", formattedEntryDate,
                    ">", formattedDateExit,
                    ")"
                );
                hasConflict = true;
                duplicates++;
            } else {
                this.bookings.push(booking);
                console.log("[SRV-HOTEL ✅] Reserva confirmada....: Quarto", booking.numberFour,
                    "-", booking.guestName,
                    "(", formattedEntryDate,
                    ">", formattedDateExit,
                    ")"
                );
                added++;
            }
        }

        console.log(`[SRV-HOTEL ✅] Reservas verificadas..: Realizadas(${added}), Duplicadas(${duplicates})`);
        return !hasConflict; // Retorna `true` apenas se todas as reservas foram confirmadas
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
            console.log(`[SRV-HOTEL 🔴] Status do Quarto......: ${numberFour} está reservado para o período solicitado`);
            return { status: 'not_available' };
        }
    
        console.log(`[SRV-HOTEL ✅] Status do Quarto......: ${numberFour} disponível no periódo solicitado`);
        return { status: 'success' };
    }
    
    
    // Método para cancelar uma reserva com base no número do quarto
    cancelBooking(bookingId: string): boolean {
        const index = this.bookings.findIndex(booking => booking.id === bookingId);
    
        if (index !== -1) {
            const removedBooking = this.bookings.splice(index, 1)[0];
            console.log("[SRV-HOTEL ✅] Reserva cancelada.....: Quarto", removedBooking.numberFour,
                "-", removedBooking.guestName
            );
            return true;
        }

        console.log(`[SRV-HOTEL 🔴] Reserva não encontrada: ${bookingId}`);
        return false;
    }    

    // Método para listar todas as reservas disponíveis (não ocupadas hoje)
    listAvailableBookings(): Booking[] {
        const today = new Date();
        return this.bookings.filter(booking => today < booking.entryDate || today > booking.dateExit);
    }
}