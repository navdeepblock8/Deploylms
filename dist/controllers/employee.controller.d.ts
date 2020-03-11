import { EmployeeRepository } from '../repositories';
import { LeaveTypeRepository } from '../repositories';
import { Employee } from '../models';
export declare class EmployeeController {
    employeeRepository: EmployeeRepository;
    leaveTypeRepository: LeaveTypeRepository;
    constructor(employeeRepository: EmployeeRepository, leaveTypeRepository: LeaveTypeRepository);
    create(employeeRequest: Employee): Promise<Object>;
    replaceById(id: string, employee: Employee): Promise<void>;
}
