import { Employee } from "./Employee";

export class Enterprise {

    // ATRIBUTOS
    private employees: Array<Employee>;

    // CONSTRUTOR
    constructor() {
        this.employees = new Array<Employee>;
    }

    // _________________________________________________________________________________________________________________________________________________________

    // Métodoo para listar funcionários
    public getAllEmployees() {
        //console.log(`[SRV-ENTERPRISE 🟡] Listando funcionários!`);
        return this.employees;
    }

    // _________________________________________________________________________________________________________________________________________________________

    // Método para adicionar funcionário
    public addEmployee(employee: Employee): boolean {

        const exists = this.employees.some(e => e.registration === employee.registration);
        // console.log(`[SRV 🟡] Recebido pedido de cadastro de funcionário: ${exists}`);

        if (!exists) {
            this.employees.push(employee);
            console.log(`[SRV-ENTERPRISE ✅] Funcionário adicionado..........: ${employee.registration} - ${employee.name} (${employee.role})`);
            //console.log('Acervo atual:', this.employees);
            return true;
        } else {
            console.log(`[SRV-ENTERPRISE 🔴] Funcionário já existe...........: ${employee.registration} - ${employee.name} (${employee.role})`);
            return false;
        }
    }

    // _________________________________________________________________________________________________________________________________________________________

    // Novo método para adicionar múltiplos funcionários
    public addEmployees(employees: Employee[]): { added: number; duplicates: number } {

        let added = 0;
        let duplicates = 0;

        employees.forEach(employee => {
            const success = this.addEmployee(employee);
            if (success) {
                added++;
            } else {
                duplicates++;
            }
        });

        console.log(`[SRV-ENTERPRISE ✅] Funcionários adicionados: Novos(${added}), Duplicados(${duplicates})`);
        return { added, duplicates };
    }

    // _________________________________________________________________________________________________________________________________________________________

    // Método para atualizar o salário de um funcionário
    public updateSalary(registration: number, salary: number): string {
        
        let employee = this.employees.find(employee => employee.registration === registration);
        // console.log(`[SRV-ENTERPRISE 🟡] Tentando alterar o salário do funcionário com código: ${registration}`);

        if (!employee) {
            console.log(`[SRV-ENTERPRISE 🔴] Funcionário não encontrado......: ${registration}`);
            return 'not_found';
        }

        console.log(`[SRV-ENTERPRISE ✅] Funcionário com salário alterado: ${employee.registration} - ${employee.name} [R$ ${employee.salary} > R$ ${salary}]`);
        employee.salary = salary;
        return 'success';
    }

    // _________________________________________________________________________________________________________________________________________________________

    // Método para verificar se o funcionário existe e retornar o funcionário
    public findEmployeeByRegistration(registration: number): Employee | null {
        
        const employee = this.employees.find(employee => employee.registration === registration);
        // console.log(`[SRV-ENTERPRISE 🟡] Verificando existência do funcionário com código: ${registration}`);

        if (!employee) {
            console.log(`[SRV-ENTERPRISE 🔴] Funcionário não encontrado......: ${registration}`);
            return null; // Retorna null caso o funcionário não seja encontrado
        }

        console.log(`[SRV-ENTERPRISE ✅] Funcionário encontrado..........: ${employee.registration} - ${employee.name} (${employee.role})`);
        return employee;
    }
    
}