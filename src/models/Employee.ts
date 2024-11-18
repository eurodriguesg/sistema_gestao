export class Employee {

    registration: number;
    name: string;
    role: string;
    salary: number;
    photoPath: string;

    constructor( registration: number, name: string, role: string, salary: number, photoPath: string) {

        this.registration = registration;
        this.name = name;
        this.role = role;
        this.salary = salary;
        this.photoPath = photoPath
    }
}