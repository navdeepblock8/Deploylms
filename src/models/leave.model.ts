import {Entity, model, property} from '@loopback/repository';

@model()
export class Leave extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  employeeId: string;

  @property({
    type: 'string',
    required: true,
  })
  approverId: string;

  @property({
    type: 'string',
    required: true,
  })
  startDate: string;

  @property({
    type: 'string',
    required: true,
  })
  endDate: string;

  @property({
    type: 'string',
    required: true,
  })
  leaveType: string;

  @property({
    type: 'boolean',
    required: true,
  })
  halfDay: boolean;

  @property({
    type: 'string',
  })
  description: string;

  @property({
    type: 'string',
    required: true,
  })
  status: string;

  @property({
    type: 'string',
  })
  message: string;


  constructor(data?: Partial<Leave>) {
    super(data);
  }
}

export interface LeaveRelations {
  // describe navigational properties here
}

export type LeaveWithRelations = Leave & LeaveRelations;
