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
    try {
      const leaveTypes = await this.leaveTypeRepository.find()
      const filterBuilder = new FilterBuilder();

      //validate employee schema
      await Employee.validate(employeeRequest);

      // Validate if the provided email already exists
      const filter = filterBuilder
        .fields("email")
        .where({ email: employeeRequest.email }).build();

      const email = await this.employeeRepository.findOne(filter)      
      if(email) {
        throw new Error("Employee Already exists");
      }
      employeeRequest.leaves = leaveTypes;
      const result = await this.employeeRepository.create(employeeRequest);
      return result;
    } catch(err) {  
      console.log(err.toString());
      throw {status: 400, message: err.toString()}
    }
  }
}
