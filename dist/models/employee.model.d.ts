import { Entity } from '@loopback/repository';
export declare class Employee extends Entity {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    empId: string;
    doj: string;
    role: string;
    approver?: string;
    gender: string;
    password: string;
    leaves: object;
    constructor(data?: Partial<Employee>);
}
export interface EmployeeRelations {
}
export declare type EmployeeWithRelations = Employee & EmployeeRelations;
