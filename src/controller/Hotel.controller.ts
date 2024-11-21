import { Request, Response } from 'express';
import path                  from 'path';
import fs                    from 'fs';
import { Hotel }             from '../models/Hotel';
import { Booking }           from '../models/Booking';

const hotel = new Hotel();

export class HotelController {

    // Listar todas as reservas
    getAllBookings(req: Request, res: Response) {
        try {
            const bookings = hotel.getAllBookings();
            res.status(200).json({ 
                message: 'Reservas do Hotel', 
                bookings: bookings
            });
        } catch (error: any) {
            console.error("[SRV-HOTEL 🔴] Erro ao listar reserva:", error);
            res.status(500).json({ 
                message: "Erro interno do servidor", 
                function: "getAllBooking", 
                stage: "Erro ao listar reserva", 
                error: error
            });
        }
    }

    // _________________________________________________________________________________________________________________________________________________________

    // Realizar reserva
    makeBookings(req: Request, res: Response) {
        
        try {
            const isArray = Array.isArray(req.body); // Verifica se é uma lista ou um objeto.
            // console.log("[SRV 🟡] Recebido pedido para realizar reserva de quarto:", req.body);        

            const booking = req.body;

            if (isArray) {
                // console.log("[SRV 🟡] Verificando dados das reservas:", JSON.stringify(booking));

                // Valida se todos os campos obrigatórios estão presentes
                const isValid = booking.every((hot: any) =>
                    hot.numberFour && hot.guestName && hot.entryDate && hot.dateExit
                );
                // console.log("[SRV 🟡] Validando campos das reservas:", JSON.stringify(isValid));

                if (!isValid) {
                    res.status(400).json({
                        message: "Todos os campos obrigatórios devem ser preenchidos",
                        fields: "numberFour, guestName, entryDate e dateExit"
                    });
                    return;
                }

                // Cria as instâncias de reserva a partir dos dados recebidos
                const bookings = booking.map(
                    (hot: any) =>
                    new Booking(
                        Number(hot.numberFour),
                        hot.guestName,
                        new Date(hot.entryDate),
                        new Date(hot.dateExit)
                    )
                );

                // Chama o método makeBookings para processar as reservas
                const result = hotel.makeBookings(bookings);

                // Se todas as reservas foram realizadas com sucesso
                if (result) {
                    res.status(200).json({
                        message: 'Reservas realizadas com sucesso',
                    });
                } else {
                    res.status(409).json({
                        message: 'Algumas reservas não puderam ser realizadas devido a conflitos de data',
                    });
                }

            } else {
                // Caso seja uma única reserva, o código continua aqui
                const { numberFour, guestName, entryDate, dateExit } = req.body;

                // Valida os campos obrigatórios para uma única reserva
                if (!numberFour || !guestName || !entryDate || !dateExit) {
                    res.status(400).json({
                        message: "Todos os campos obrigatórios devem ser preenchidos",
                        fields: "numberFour, guestName, entryDate e dateExit"
                    });
                    return;
                }

                // Cria a instância de reserva
                const booking = new Booking(
                    Number(numberFour),
                    guestName,
                    new Date(entryDate),
                    new Date(dateExit)
                );
                // console.log("[SRV 🟡] Validando campos das reservas:", JSON.stringify(booking));

                // Chama o método makeReservation para processar a reserva individual
                const added = hotel.makeBooking(booking);

                if (added) {
                    res.status(201).json({
                        message: 'Reserva realizada com sucesso',
                        bookingId: booking.id,
                        numberFour: booking.numberFour,
                        guestName: booking.guestName
                    });
                } else {
                    res.status(409).json({
                        message: 'Reserva não realizada devido a conflito de data',
                        booking: booking.numberFour,
                        guestName: booking.guestName
                    });
                }
            }

        } catch (error: any) {
            console.error(`[SRV-HOTEL 🔴] Erro ao realizar a reserva: ${error.message}`);
            res.status(500).json({
                message: "Erro interno do servidor",
                function: "makeBooking",
                stage: "Erro ao realizar a reserva",
                error: error
            });
        }
    }

    // _________________________________________________________________________________________________________________________________________________________

    // Consultar disponibilidade de quarto
    checkRoomAvailability(req: Request, res: Response) {
        try {
            const { numberFour, entryDate, dateExit } = req.body;

            if (!numberFour || !entryDate || !dateExit) {
                res.status(400).json({ 
                    message: "Todos os campos obrigatórios devem ser preenchidos",
                    fields: "numberFour, entryDate e dateExit"
                });
                return;
            }

            // Validar se `numberFour` é um número
            if (isNaN(Number(numberFour))) {
                res.status(400).json({ message: "O número do quarto deve ser um número válido." });
                return;
            }

            // Converter strings de datas para objetos Date
            const entry = new Date(entryDate);
            const exit = new Date(dateExit);

            // Validar se as datas são válidas
            if (isNaN(entry.getTime()) || isNaN(exit.getTime())) {
                res.status(400).json({ message: "Datas inválidas." });
                return;
            }

            // Validar se a data de entrada é antes da data de saída
            if (entry >= exit) {
                res.status(400).json({ message: "A data de entrada deve ser anterior à data de saída." });
                return;
            }

            // Chamar o método do model para verificar disponibilidade
            const result = hotel.checkRoomAvailability(Number(numberFour), entry, exit);

            // Analisar o status retornado
            switch (result.status) {
                case 'not_found':
                    res.status(404).json({ 
                        message: 'Quarto não encontrado', 
                        numberFour 
                    });
                    break;
                case 'not_available':
                    res.status(409).json({ 
                        message: 'Quarto reservado', 
                        numberFour 
                    });
                    break;
                case 'success':
                    res.status(200).json({ 
                        message: 'Quarto disponível', 
                        numberFour 
                    });
                    break;
                default:
                    res.status(500).json({ 
                        message: 'Erro desconhecido', 
                        details: result.details || null 
                    });
            }
        } catch (error: any) {
            console.error(`[SRV-HOTEL 🔴] Erro ao obter quarto por número: ${error.message}`);
            res.status(500).json({ 
                message: "Erro interno do servidor", 
                function: "checkRoomAvailability", 
                error: error.message 
            });
        }
    }


    // Cancelar uma reserva
    cancelBooking(req: Request, res: Response) {
        try {
            const bookingId = req.params.bookingId; // Obtém o número do quarto da URL

            if (!bookingId) {
                res.status(400).json({ 
                    message: "O número da reserva é obrigatório",
                    fields: "bookingId"
                });
                return;
            }

            const result = hotel.cancelBooking(bookingId); // Chama o método de cancelamento da reserva

            if (!result) {
                res.status(404).json({ 
                    message: 'Reserva não encontrada', 
                    bookingId: bookingId
                });
            } else if (result) {
                res.status(200).json({ 
                    message: 'Reserva cancelada com sucesso', 
                    bookingId: bookingId
                });
            } else {
                res.status(500).json({ 
                    message: 'Erro desconhecido ao cancelar a reserva'
                });
            }
        } catch (error: any) {
            console.error(`[SRV-HOTEL 🔴] Erro ao cancelar reserva: ${error.message}`);
            res.status(500).json({ 
                message: "Erro interno do servidor", 
                function: "cancelBooking", 
                stage: "Erro ao cancelar reserva", 
                error: error
            });
        }
    }

}
