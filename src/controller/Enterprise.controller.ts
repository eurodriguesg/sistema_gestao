import { Request, Response } from 'express';
import path                  from 'path';
import fs                    from 'fs';
import { Enterprise }        from '../models/Enterprise';
import { Employee }          from '../models/Employee';

const enterprise = new Enterprise();

export class EnterpriseController {

    // Listar todos os funcionários
    async getAllEmployees(req: Request, res: Response) {
        try {
            const employees = enterprise.getAllEmployees();
            res.status(200).json({ 
                message: 'Funcionários da Empresa', 
                employees: employees
            });
        } catch (error: any) {
            console.error("[SRV-ENTERPRISE 🔴] Erro ao listar funcionários:", error);
            res.status(500).json({ 
                message: "Erro interno do servidor", 
                function: "getAllEmployees", 
                stage: "Erro ao listar funcionários", 
                error: error
            });
        }
    }

    // _________________________________________________________________________________________________________________________________________________________

    // Adicionar funcionários
    /*async addEmployee(req: Request, res: Response) {
        // console.log("[SRV 🟡] Recebido pedido de cadastro de funcionário:", req.body);
    
        try {
            const isArray = Array.isArray(req.body); // Aqui verifica se é uma lista ou um objeto.
    
            if (isArray) {
                const employees = req.body;
                // console.log("[SRV 🟡] Verificando dados dos funcionários:", JSON.stringify(employees));
    
                const isValid = employees.every((emp: any) =>
                    emp.registration && emp.name && emp.role && emp.salary
                );
               // console.log("[SRV 🟡] Validando campos do funcionário:", JSON.stringify(isValid));
    
                if (!isValid) {
                    res.status(400).json({ 
                        message: "Todos os campos obrigatórios devem ser preenchidos",
                        fields: "registration, name, role e salary"
                    });
                    return;
                }
    
                const employeeInstances = employees.map(
                    (emp: any) =>
                        new Employee(
                            Number(emp.registration),
                            emp.name,
                            emp.role,
                            Number(emp.salary),
                            emp.photoPath || "/images/default-avatar.png"
                        )
                );
    
                const result = enterprise.addEmployees(employeeInstances);

                res.status(200).json({
                    message: 'Funcionários adicionados com sucesso',
                    added: result.added,
                    duplicates: result.duplicates,
                });

            } else {
                
                const { registration, name, role, salary } = req.body;
                // console.log("[SRV 🟡] Verificando dados do funcionário:", req.body);
    
                if (!registration || !name || !role || !salary) {
                    res.status(400).json({ 
                        message: "Todos os campos obrigatórios devem ser preenchidos",
                        fields: "registration, name, role e salary"
                    });
                    return;
                }
    
                let photoPath = req.file ? `/uploads/${req.file.filename}` : "/images/default-avatar.png";
    
                if (req.file) {
                    const newFileName = `${registration}${path.extname(req.file.originalname)}`;
                    const newFilePath = path.join(__dirname, "../public/uploads", newFileName);
    
                    try {
                        fs.renameSync(req.file.path, newFilePath);
                        photoPath = `/uploads/${newFileName}`;
                    } catch (error) {
                        console.error("[SRV-ENTERPRISE 🔴] Erro ao renomear o arquivo:", error);
                        res.status(500).json({ 
                            message: "Erro interno do servidor", 
                            function: "addEmployee", 
                            stage: "Erro ao renomear o arquivo", 
                            error: error
                        });
                    }
                }
    
                const employee = new Employee(Number(registration), name, role, Number(salary), photoPath);
                const added    = enterprise.addEmployee(employee);
    
                if (added) {
                    res.status(201).json({
                        message: 'Funcionário adicionado com sucesso', 
                        book: `${employee.registration} - ${employee.name} (${employee.role})`
                    });
                } else {
                    res.status(409).json({
                        message: 'Funcionário já existe',
                        employee: `${employee.registration} - ${employee.name} (${employee.role})`
                    });
                }
            }
        } catch (error: any) {
            console.error(`[SRV-ENTERPRISE 🔴] Erro ao adicionar funcionário(s): ${error.message}`);
            res.status(500).json({ 
                message: "Erro interno do servidor", 
                function: "addEmployee", 
                stage: "Erro ao adicionar funcionário(s)", 
                error: error
            });
        }
    }*/
    // ARMAZENAAMENTO BUFFER: Adicionar funcionário sem armazenar imagens
    async addEmployee(req: Request, res: Response) {
        try {
            const { registration, name, role, salary } = req.body;

            if (!registration || !name || !role || !salary) {
                res.status(400).json({
                    message: "Todos os campos obrigatórios devem ser preenchidos",
                    fields: "registration, name, role e salary",
                });
                return;
            }

            const employee = new Employee(
                Number(registration),
                name,
                role,
                Number(salary),
                '' // Não há mais necessidade de armazenar o photoPath
            );
            const added = enterprise.addEmployee(employee);

            if (added) {
                res.status(201).json({
                    message: 'Funcionário adicionado com sucesso',
                    employee: `${employee.registration} - ${employee.name} (${employee.role})`,
                });
            } else {
                res.status(409).json({
                    message: 'Funcionário já existe',
                    employee: `${employee.registration} - ${employee.name} (${employee.role})`,
                });
            }
        } catch (error: any) {
            console.error(`[SRV-ENTERPRISE 🔴] Erro ao adicionar funcionário(s): ${error.message}`);
            res.status(500).json({
                message: "Erro interno do servidor",
                function: "addEmployee",
                stage: "Erro ao adicionar funcionário(s)",
                error: error,
            });
        }
    }
    
    // _________________________________________________________________________________________________________________________________________________________

    // Alterar salário do funcionário
    async changeSalary(req: Request, res: Response) {
        try {
            const { registration, salary } = req.body;

            if (!registration || !salary) {
                res.status(400).json({ 
                    message: "Todos os campos obrigatórios devem ser preenchidos",
                    fields: "registration e salary"
                });
                return;
            }

            const result = enterprise.updateSalary(Number(registration), Number(salary));

            if (result === 'not_found') {
                res.status(404).json({ 
                    message: `Funcionário não encontrado`,
                    registration: registration
                });
            } else if (result === 'success') {
                res.status(200).json({
                    message: `Salário alterado com sucesso para R$ ${salary}`,
                    registration: registration,
                    salary: salary
                });
            } else {
                res.status(500).json({ 
                    message: "Erro interno do servidor", 
                    function: "changeSalary", 
                    stage: "Erro ao alterar salário"
                });
            }
        } catch (error: any) {
            console.error(`[SRV-ENTERPRISE 🔴] Erro ao alterar salário do funcionário: ${error.message}`);
            res.status(500).json({ 
                message: "Erro interno do servidor", 
                function: "changeSalary", 
                stage: "Erro ao alterar salário do funcionário", 
                error: error
            });
        }
    }

    // _________________________________________________________________________________________________________________________________________________________

    // Consultar funcionário por registro
    async getEmployeeByRegistration(req: Request, res: Response) {
        
        try {
            const registration = parseInt(req.params.registration);

            if (!registration) {
                res.status(400).json({ 
                    message: "Todos os campos obrigatórios devem ser preenchidos",
                    fields: "registration"
                });
                return;
            }

            const employee = enterprise.findEmployeeByRegistration(registration);

            if (employee) {
                res.status(200).json({ 
                    message: 'Funcionário encontrado', 
                    employee: employee
                });
            } else {
                res.status(404).json({ 
                    message: 'Funcionário não encontrado',
                    registration: registration
                });
            }
        } catch (error: any) {
            console.error(`[SRV-ENTERPRISE 🔴] Erro ao obter funcionário por registro: ${error.message}`);
            res.status(500).json({ 
                message: "Erro interno do servidor", 
                function: "addEmployee", 
                stage: "Erro ao obter funcionário por registro", 
                error: error
            });
        }
    }
}
