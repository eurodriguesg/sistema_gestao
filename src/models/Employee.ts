export class Employee {

    registration: number;
    name: string;
    role: string;
    salary: number;

    constructor( registration: number, name: string, role: string, salary: number) {

        this.registration = registration;
        this.name = name;
        this.role = role;
        this.salary = salary;
    }
}