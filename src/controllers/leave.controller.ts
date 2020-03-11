import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Leave} from '../models';
import {LeaveRepository} from '../repositories';
import {EmployeeRepository} from '../repositories';

export class LeaveController {
  constructor(
    @repository(LeaveRepository)
    public leaveRepository : LeaveRepository,

    @repository(EmployeeRepository)
    public employeeRepository: EmployeeRepository
  ) {}

  invalidDays = (startDate: string, endDate: string, halfDay: boolean) =>  {
    if(!halfDay)
        return false;

    let start = new Date(startDate)
    let end = new Date(endDate)
    return start.toString() !== end.toString()
  }

  getLeaveDuration = (start: string, end: string, halfDay: boolean) => {
    if(halfDay)
        return 0.5;

    let startDate = new Date(start)
    let endDate = new Date(end)
    let count = 0;
    for(var d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        let day = d.getDay()
        if(day == 0 || day == 6) {
            continue;
        }
        count++;
    }
    return count;
  }


  @post('/leaves', {
    responses: {
      '200': {
        description: 'Leave model instance',
        content: {'application/json': {schema: getModelSchemaRef(Leave)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Leave, {
            title: 'NewLeave',
            exclude: ['id', 'firstName', 'lastName'],
          }),
        },
      },
    })
    leave: Omit<Leave, 'id & firstName & lastName'>,
  ): Promise<Leave> {
    try {
      console.log(leave)
      await Leave.validate(leave)
      const employee = await this.employeeRepository.findById(leave.employeeId)
      if(!employee)
        throw new Error("Invalid Employee Id")
      
      const approver = await this.employeeRepository.findById(leave.approverId)
      
      if(employee.approver != leave.approverId)
        throw new Error("Provided approver is not the approver of provided employee")

      if(!approver)
        throw new Error("Invalid Approver Id")

      if(this.invalidDays(leave.startDate, leave.endDate, leave.halfDay))
        throw new Error("start and end date should be same for half day")

      let daysCount = this.getLeaveDuration(leave.startDate, leave.endDate, leave.halfDay);
      const employeeLeave = employee.leaves.find(leaveObject => leaveObject.type === leave.leaveType);
      if(employeeLeave === undefined || employeeLeave.available < daysCount) {
        throw new Error("Employee Does not have that many leaves of the given type")
      }
      employeeLeave.available -= daysCount;
      employeeLeave.applied += daysCount;

      leave.status = "pending"
      leave.firstName = employee.firstName;
      leave.lastName = employee.lastName;

      await this.employeeRepository.update(employee);
      const savedLeave = await this.leaveRepository.create(leave);
      
      return savedLeave;

    } catch(err) {
      console.log(err.stack)
      console.log(err.toString());
      throw {status: 400, message: err.toString()}
    }
  }

  @get('/leaves/count', {
    responses: {
      '200': {
        description: 'Leave model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Leave)) where?: Where<Leave>,
  ): Promise<Count> {
    return this.leaveRepository.count(where);
  }

  @get('/leaves', {
    responses: {
      '200': {
        description: 'Array of Leave model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Leave, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Leave)) filter?: Filter<Leave>,
  ): Promise<Leave[]> {
    return this.leaveRepository.find(filter);
  }

  @patch('/leaves', {
    responses: {
      '200': {
        description: 'Leave PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Leave, {partial: true}),
        },
      },
    })
    leave: Leave,
    @param.query.object('where', getWhereSchemaFor(Leave)) where?: Where<Leave>,
  ): Promise<Count> {
    return this.leaveRepository.updateAll(leave, where);
  }

  @get('/leaves/{id}', {
    responses: {
      '200': {
        description: 'Leave model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Leave, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(Leave)) filter?: Filter<Leave>
  ): Promise<Leave> {
    return this.leaveRepository.findById(id, filter);
  }

  @patch('/leaves/{id}', {
    responses: {
      '204': {
        description: 'Leave PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Leave, {partial: true}),
        },
      },
    })
    leave: Leave,
  ): Promise<void> {
    await this.leaveRepository.updateById(id, leave);
  }

  @put('/leaves/{id}', {
    responses: {
      '204': {
        description: 'Leave PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() leave: Leave,
  ): Promise<void> {
    await this.leaveRepository.replaceById(id, leave);
  }

  @del('/leaves/{id}', {
    responses: {
      '204': {
        description: 'Leave DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.leaveRepository.deleteById(id);
  }
}
