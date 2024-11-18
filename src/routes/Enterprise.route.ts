import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Enterprise } from '../models/Enterprise';
import { Employee } from '../models/Employee';

const router = express.Router();
const enterprise = new Enterprise();

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

router.post('/addEmployee', upload.single('photo'), (req: Request, res: Response) => {
    try {
        // Verificar se é uma lista de funcionários ou um único funcionário
        const isArray = Array.isArray(req.body);

        if (isArray) {
            const employees = req.body;

            // Validar os campos obrigatórios para cada funcionário
            const isValid = employees.every((emp: any) => emp.registration && emp.name && emp.role && emp.salary);

            if (!isValid) {
                res.status(400).json({ message: 'Todos os funcionários devem ter registration, name, role e salary.' });
                return;
            }

            // Converter o array para instâncias da classe Employee
            const employeeInstances = employees.map((emp: any) => new Employee(
                Number(emp.registration),
                emp.name,
                emp.role,
                Number(emp.salary),
                emp.photoPath || '/images/default-avatar.png' // Caminho padrão da foto
            ));

            // Adicionar funcionários usando o método addEmployees
            const result = enterprise.addEmployees(employeeInstances);

            res.status(200).json({
                message: 'Processamento concluído.',
                added: result.added,
                duplicates: result.duplicates
            });
            return;
        } else {
            // Caso seja um único funcionário (objeto)
            const { registration, name, role, salary } = req.body;

            // Validação dos campos obrigatórios
            if (!registration || !name || !role || !salary) {
                res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
                return;
            }

            // Caminho padrão da foto
            let photoPath = req.file ? `/uploads/${req.file.filename}` : '/images/default-avatar.png';

            // Renomear a foto usando o 'registration'
            if (req.file) {
                const newFileName = `${registration}${path.extname(req.file.originalname)}`;
                const newFilePath = path.join(__dirname, '../public/uploads', newFileName);

                try {
                    fs.renameSync(req.file.path, newFilePath);
                    photoPath = `/uploads/${newFileName}`;
                } catch (error) {
                    console.error('Erro ao renomear o arquivo:', error);
                }
            }

            // Criar funcionário e adicioná-lo ao sistema
            const employee = new Employee(Number(registration), name, role, Number(salary), photoPath);
            const added = enterprise.addEmployee(employee);

            if (added) {
                res.status(200).json({
                    message: 'Funcionário adicionado com sucesso!',
                    employee
                });
            } else {
                res.status(409).json({
                    message: `Funcionário com código ${registration} já existe.`
                });
            }
        }
    } catch (error: any) {
        console.error(`[SRV-ENTERPRISE] Erro ao adicionar funcionário(s): ${error.message}`);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});


// Alterar salário do funcionário
router.post('/changeSalary', (req, res) => {
    try {
        const { registration, salary } = req.body;

        if (!registration || !salary) {
            throw new Error('Campos obrigatórios devem ser preenchidos: registration e salary.');
        }

        const result = enterprise.updateSalary(Number(registration), Number(salary));

        if (result === 'not_found') {
            res.status(404).json({ message: `Funcionário com código ${registration} não encontrado.` });
        } else if (result === 'success') {
            res.status(200).json({ message: `Salário do funcionário com código ${registration} atualizado com sucesso para R$ ${salary}` });
        } else {
            res.status(500).json({ message: 'Erro desconhecido ao atualizar salário.' });
        }
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

// Listar todos os funcionários
router.get('/list', (req, res) => {
    console.log(`[SRV-ENTERPRISE 🟡] Listando funcionários!`);
    try {
        const employees = enterprise.listEmployees();
        res.status(200).json({ employees });
    } catch (error: any) {
        res.status(500).json({ message: 'Erro ao listar funcionários.', error: error.message });
    }
});

// Consultar existência do funcionário
router.get('/:registration', (req, res) => {
    try {
        const registration = parseInt(req.params.registration);
        console.log(`[SRV-ENTERPRISE 🟡] Listando funcionário com código: ${registration}`);

        if (!registration) {
            throw new Error('Campo obrigatório deve ser preenchido: registration.');
        }

        const employee = enterprise.findEmployeeByRegistration(registration);

        if (employee) {
            res.status(200).json({ message: 'Funcionário encontrado.', employee });
        } else {
            res.status(404).json({ message: 'Funcionário não encontrado.' });
        }
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
