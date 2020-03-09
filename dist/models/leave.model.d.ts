import { Entity } from '@loopback/repository';
export declare class Leave extends Entity {
    id?: string;
    employeeId: string;
    approverId: string;
    startDate: string;
    endDate: string;
    leaveType: string;
    halfDay: boolean;
    description: string;
    status: string;
    message: string;
    constructor(data?: Partial<Leave>);
}
export interface LeaveRelations {
}
export declare type LeaveWithRelations = Leave & LeaveRelations;
