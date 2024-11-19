import { Booking } from './Booking';

export class Hotel {

    private reservations: Array<Booking>;

    constructor() {
        this.reservations = new Array<Booking>();
    }

    // Método para registrar uma nova reserva
    registrarReserva(reserva: Booking): boolean {
        const conflito = this.reservations.some(r =>
            r.numberFour === reserva.numberFour &&
            ((reserva.entryDate >= r.entryDate && reserva.entryDate <= r.dateExit) ||
                (reserva.dateExit >= r.entryDate && reserva.dateExit <= r.dateExit) ||
                (reserva.entryDate <= r.entryDate && reserva.dateExit >= r.dateExit))
        );

        if (conflito) {
            console.log(`[SRV-HOTEL 🔴] O quarto ${reserva.numberFour} já está reservado no período escolhido.`);
            return false;
        }

        this.reservations.push(reserva);
        console.log(`[SRV-HOTEL ✅] Reserva para o quarto ${reserva.numberFour} foi registrada com sucesso.`);
        return true;
    }

    // Método para consultar o status do quarto
    consultStatusRoom(numeroQuarto: number): string {
        const hoje = new Date();

        for (const reserva of this.reservations) {
            if (reserva.numberFour === numeroQuarto) {
                if (hoje >= reserva.entryDate && hoje <= reserva.dateExit) {
                    return `Quarto ${numeroQuarto} está ocupado pelo hóspede ${reserva.guestName}.`;
                }
                return `Quarto ${numeroQuarto} está reservado para o hóspede ${reserva.guestName}, mas não está ocupado hoje.`;
            }
        }

        return `Quarto ${numeroQuarto} está disponível.`;
    }

    // Método para cancelar uma reserva com base no número do quarto
    cancelarReserva(numeroQuarto: number): void {
        const index = this.reservations.findIndex(r => r.numberFour === numeroQuarto);

        if (index !== -1) {
            const reservaRemovida = this.reservations.splice(index, 1)[0];
            console.log(`Reserva para o quarto ${reservaRemovida.numberFour}, hóspede ${reservaRemovida.guestName}, foi cancelada com sucesso.`);
        } else {
            console.log(`Erro: Não foi encontrada nenhuma reserva para o quarto ${numeroQuarto}.`);
        }
    }

    // Método para listar todas as reservas disponíveis (não ocupadas hoje)
    listAvailableBookings(): Booking[] {
        const hoje = new Date();
        return this.reservations.filter(reserva => hoje < reserva.entryDate || hoje > reserva.dateExit);
    }

    // Método para obter todas as reservas registradas
    getAllBookings(): Booking[] {
        return this.reservations;
    }
    
}