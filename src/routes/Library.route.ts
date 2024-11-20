import { Router } from 'express';
import { LibraryController } from '../controller/Library.controller';

const router = Router();

router.get('/getAllBooks', LibraryController.getAllBooks);

router.post('/addBooks', LibraryController.addBooks);

router.post('/bookLoan/:code', LibraryController.registerLoan);

router.post('/bookReturn/:code', LibraryController.registerReturn);

router.post('/checkAvailability/:code', LibraryController.checkAvailability);

router.post('/searchBook/:code', LibraryController.searchBook);

router.get('/listAvailableBooks', LibraryController.listAvailableBooks);

export default router;
