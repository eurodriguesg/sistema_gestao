import { Router } from 'express';
import { Enterprise } from '../models/Enterprise';
import { Employee } from '../models/Employee';

const router = Router();
const enterprise = new Enterprise();

// ADICIONAR FUNCIONÁRIO
router.post('/addEmployee', (req, res) => {
    try {
        const { registration, name, role, salary } = req.body;

        if (!registration) {
            throw new Error('Campo obrigatório deve ser preenchidos: registration');
        }
        if (!name) {
            throw new Error('Campo obrigatório deve ser preenchidos: name');
        }
        if (!role) {
            throw new Error('Campo obrigatório deve ser preenchidos: role');
        }
        if (!salary) {
            throw new Error('Campo obrigatório deve ser preenchidos: salary');
        }

        // Criar o funcionário e tentar adicioná-lo a empresa
        const employee = new Employee(Number(registration), name, role, Number(salary));
        const added = enterprise.addEmployee(employee);

        if (added) {
            res.status(201).send(employee);
        } else {
            res.status(409).send({ message: `Funcionário com código ${employee.registration} já existe na empresa.` });
        }
    } catch (error: any) {
        res.status(400).send({ message: error.message });
    }
});

// ALTERAR SALÁRIO DO FUNCIONÁRIO
router.post('/changeSalary', (req, res) => {
    try {
        const { registration, salary } = req.body;

        if (!registration) {
            throw new Error('Campo obrigatório deve ser preenchido: registration');
        }
        if (!salary) {
            throw new Error('Campo obrigatório deve ser preenchido: salary');
        }

        // Alterar salário do funcionário
        const result = enterprise.updateSalary(Number(registration), Number(salary));

        if (result === 'not_found') {
            res.status(404).send({ message: `Funcionário com código ${registration} não encontrado.` });
        } else if (result === 'success') {
            res.status(200).send({ message: `Salário do funcionário com código ${registration} atualizado com sucesso para R$ ${salary}` });
        } else {
            res.status(500).send({ message: 'Erro desconhecido ao atualizar salário' });
        }
    } catch (error: any) {
        res.status(400).send({ message: error.message });
    }
});

// CONSULTAR EXISTÊNCIA DO 
router.post('/:registration', (req, res) => {

    const registration = parseInt(req.params.registration);
    //console.log(`[SRV 🟡] Recebido pedido de consulta de funcionário com código: ${registration}`);

    if (!registration) {
        throw new Error('Campo obrigatório deve ser preenchido: registration');
    }

    const employee = enterprise.findEmployeeByRegistration(registration);
    // console.log(availableBooks)

    if (employee) {
        res.status(200).send({ message: 'Funcionário disponível', employee: employee});
    } else if (!employee) {
        res.status(409).send({ message: 'Funcionário não encontrado' });
    } else {
        res.status(500).send({ message: 'Erro desconhecido' });
    }
    
});

export default router;
