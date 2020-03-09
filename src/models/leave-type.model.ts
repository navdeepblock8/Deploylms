import {Entity, model, property} from '@loopback/repository';

@model()
export class LeaveType extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  type: string;

  @property({
    type: 'number',
    required: true,
  })
  total: number;

  @property({
    type: 'number',
    required: true,
    default: 0
  })
  applied: number;

  @property({
    type: 'number',
    required: true,
    default: 0
  })
  availed: number;

  @property({
    type: 'number',
    required: true,
    default: 0
  })
  available: number;

  constructor(data?: Partial<LeaveType>) {
    super(data);
  }
}

export interface LeaveTypeRelations {
  // describe navigational properties here
}

export type LeaveTypeWithRelations = LeaveType & LeaveTypeRelations;
