import { Router, Request, Response, RequestHandler } from 'express';
import { Booking } from './../models/Booking';
import { Hotel } from './../models/Hotel'

const router = Router();
const hotel = new Hotel();

// Registrar uma nova reserva
const registrarReserva: RequestHandler = (req: Request, res: Response): void => {
    const { numberFour, guestName, entryDate, dateExit } = req.body;

    if (!numberFour) {
        res.status(400).json({ error: 'O campo [numberFour] é obrigatórios.' });
        return;
    }
    else if (!guestName) {
        res.status(400).json({ error: 'O campo [guestName] é obrigatórios.' });
        return;
    }
    else if (!entryDate) {
        res.status(400).json({ error: 'O campo [entryDate] é obrigatórios.' });
        return;
    }
    else if (!dateExit) {
        res.status(400).json({ error: 'O campo [dateExit] é obrigatórios.' });
        return;
    }

    const reserva = new Booking(
        Number(numberFour),
        guestName,
        new Date(entryDate),
        new Date(dateExit)
    );

    const result = hotel.registrarReserva(reserva);

    if (result) {
        res.status(201).json({ message: 'Reserva realizada com sucesso!', reserva });
    } else {
        res.status(409).json({ message: `Quarto ${reserva.numberFour} já está reservado no período escolhido.` });
    }
    return;
};

// Cancelar uma reserva
const cancelarReserva: RequestHandler = (req: Request, res: Response): void => {

    const numeroQuarto = parseInt(req.params.numberFour);
    console.log(`[SRV-HOTEL 🟡] Tentando realizar o cancelamento da reserva para o quarto com número: ${numeroQuarto}`);

    if (isNaN(numeroQuarto)) {
        res.status(400).json({ error: 'Número do quarto inválido.' });
        return;
    }

    const result = hotel.cancelarReserva(numeroQuarto);
    res.json({ message: result });
    return;
};

// Listar todas as reservas
const listarReservas: RequestHandler = (_req: Request, res: Response): void => {
    const todasReservas = hotel.getAllBookings();
    res.json(todasReservas);
    return;
};

// Consultar status de um quarto
const consultStatusRoom: RequestHandler = (req: Request, res: Response): void => {
    const numeroQuarto = parseInt(req.params.numberFour);

    if (isNaN(numeroQuarto)) {
        res.status(400).json({ error: 'Número do quarto inválido.' });
        return;
    }

    const status = hotel.consultStatusRoom(numeroQuarto);
    res.json({ status });
    return;
};

// Definindo as rotas
router.post('/makeReservation', registrarReserva);
router.delete('/cancelReservation/:numberFour', cancelarReserva);
router.get('/reservas', listarReservas);
router.get('/status/:numberFour', consultStatusRoom);

export default router;
