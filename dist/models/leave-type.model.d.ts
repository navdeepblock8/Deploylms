import { Entity } from '@loopback/repository';
export declare class LeaveType extends Entity {
    type: string;
    total: number;
    applied: number;
    availed: number;
    available: number;
    constructor(data?: Partial<LeaveType>);
}
export interface LeaveTypeRelations {
}
export declare type LeaveTypeWithRelations = LeaveType & LeaveTypeRelations;
