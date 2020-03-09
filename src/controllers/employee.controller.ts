import {repository, FilterBuilder} from '@loopback/repository';
import {EmployeeRepository} from '../repositories';
import {LeaveTypeRepository} from '../repositories';
import {post, requestBody, getModelSchemaRef} from '@loopback/rest';
import {LeaveType, Employee} from '../models';

// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';

export class EmployeeController {
  constructor(
    @repository(EmployeeRepository)
    public employeeRepository: EmployeeRepository,
    @repository(LeaveTypeRepository)
    public leaveTypeRepository: LeaveTypeRepository,
  ) {}

  @post('/employee', {
    responses: {
      '200': {
        description: 'Employee model instance',
        content: {'application/json': {schema: getModelSchemaRef(Employee)}},
      },
    }
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Employee, {
            exclude: ['id', 'leaves'],
          }),
        },
      },
    })
    employeeRequest: Employee,
  ): Promise<Object> {
    const leaveTypes = await this.leaveTypeRepository.find()
    const filterBuilder = new FilterBuilder();

    const filter = filterBuilder
      .fields("email")
      .where({ email: employeeRequest.email }).build();
    const emails = await this.employeeRepository.find(filter)
    if(emails) {
      console.log(`Error: "Employee Already Exists`)
      throw {status: 400, message: 'Employee Already Exists'};
    }
    employeeRequest.leaves = leaveTypes;
    return this.employeeRepository.create(employeeRequest);
  }
}
