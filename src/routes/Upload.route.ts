import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Configuração do multer para upload de fotos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: (req, file, cb) => {
        // Nome inicial genérico; renomearemos após obter o 'registration'
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

// Rota para adicionar funcionário e fazer upload de foto
router.post('/employees', upload.single('photo'), (req: Request, res: Response) => {
    const { registration, name, role, salary } = req.body;
    let photoPath = req.file ? `/uploads/${req.file.filename}` : '/images/default-avatar.png';

    // Renomear a foto usando o registration
    if (req.file && registration) {
        const newFileName = `${registration}${path.extname(req.file.originalname)}`;
        const newFilePath = path.join(__dirname, '../public/uploads', newFileName);

        try {
            fs.renameSync(req.file.path, newFilePath);
            photoPath = `/uploads/${newFileName}`;
        } catch (error) {
            console.error('Erro ao renomear arquivo:', error);
        }
    }

    // Criação do objeto funcionário
    const newEmployee = {
        registration,
        name,
        role,
        salary,
        photo: photoPath
    };

    // Retornando resposta ao cliente
    res.status(200).json({
        message: 'Funcionário adicionado com sucesso!',
        employee: newEmployee
    });
});

export default router;
