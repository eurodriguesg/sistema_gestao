import { Employee } from "./Employee";

export class Enterprise {

    // ATRIBUTOS
    private employees: Array<Employee>;

    constructor() {
        this.employees = new Array<Employee>;
    }

    // Método para adicionar funcionário
    public addEmployee(employee: Employee): boolean {

        const exists = this.employees.some(e => e.registration === employee.registration);
        // console.log(`[SRV 🟡] Recebido pedido de cadastro de funcionário: ${exists}`);

        if (!exists) {
            this.employees.push(employee);
            console.log(`[SRV-ENTERPRISE ✅] Funcionário adicionado: ${employee.registration} - ${employee.name} (${employee.role})`);
            //console.log('Acervo atual:', this.employees);
            return true;
        } else {
            console.log(`[SRV-ENTERPRISE 🔴] Funcionário com código ${employee.registration} já existe na empresa`);
            return false;
        }
    }

    // Método para atualizar o salário de um funcionário
    public updateSalary(registration: number, salary: number): string {
        console.log(`[SRV-ENTERPRISE 🟡] Tentando alterar o salário do funcionário com código: ${registration}`);

        let employee = this.employees.find(employee => employee.registration === registration);
        if (!employee) {
            console.log(`[SRV-ENTERPRISE 🔴] Funcionário com código ${registration} não encontrado`);
            return 'not_found';
        }

        console.log(`[SRV-ENTERPRISE ✅] Funcionário teve alteração no salário de: R$ ${employee.salary} > R$ ${salary}`);
        employee.salary = salary;
        return 'success';
    }

    // Método para verificar se o funcionário existe e retornar o funcionário
    public findEmployeeByRegistration(registration: number): Employee | null {
        console.log(`[SRV-ENTERPRISE 🟡] Verificando existência do funcionário com código: ${registration}`);

        const employee = this.employees.find(employee => employee.registration === registration);
        if (!employee) {
            console.log(`[SRV-ENTERPRISE 🔴] Funcionário com código ${registration} não encontrado`);
            return null; // Retorna null caso o funcionário não seja encontrado
        }

        console.log(`[SRV-ENTERPRISE ✅] Funcionário encontrado: ${employee.name}, código: ${registration}`);
        return employee;
    }

    public listEmployees() {
        //console.log(`[SRV-ENTERPRISE 🟡] Listando funcionários!`);
        return this.employees;
    }
    
}