import express                  from 'express';
import multer                   from 'multer';
import path                     from 'path';
import { HotelController } from '../controller/Hotel.controller';

const router               = express.Router();
const hotelController = new HotelController();

// Rota para listar reservas
router.get('/getAllBookings', hotelController.getAllBookings);

// Rota para realizar reserva
router.post('/makeBooking', hotelController.makeBookings);

// Rota para consultar reserva por quarto
router.post('/checkRoomAvailability', hotelController.checkRoomAvailability);

// Rota para cancelar reserva
router.delete('/cancelBooking/:bookingId', hotelController.cancelBooking);


export default router;

