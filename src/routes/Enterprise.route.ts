import express                  from 'express';
import multer                   from 'multer';
import path                     from 'path';
import { EnterpriseController } from '../controller/Enterprise.controller';

const router               = express.Router();
const enterpriseController = new EnterpriseController();

// Configuração do multer para upload de fotos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

// Rota para listar funcionários
router.get('/getAllEmployees', enterpriseController.getAllEmployees);

// Rota para adicionar funcionário(s)
router.post('/addEmployee', upload.single('photo'), enterpriseController.addEmployee);

// Rota para alterar salário
router.post('/changeSalary', enterpriseController.changeSalary);

// Rota para consultar funcionário por registro
router.get('/:registration', enterpriseController.getEmployeeByRegistration);

export default router;
