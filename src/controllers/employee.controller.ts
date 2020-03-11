import { repository, FilterBuilder } from '@loopback/repository';
import { EmployeeRepository } from '../repositories';
import { LeaveTypeRepository } from '../repositories';
import { put, param, post, requestBody, getModelSchemaRef } from '@loopback/rest';
import { LeaveType, Employee } from '../models';

// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';

export class EmployeeController {
  constructor(
    @repository(EmployeeRepository)
    public employeeRepository: EmployeeRepository,
    @repository(LeaveTypeRepository)
    public leaveTypeRepository: LeaveTypeRepository,
  ) { }

  @post('/employee', {
    responses: {
      '200': {
        description: 'Employee model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Employee) } },
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
      const filterBuilder = new FilterBuilder();

      //validate employee schema
      await Employee.validate(employeeRequest);

      // Validate if the provided email already exists
      const filter = filterBuilder
        .fields("email")
        .where({ email: employeeRequest.email }).build();

      const email = await this.employeeRepository.findOne(filter)
      if (email) {
        throw new Error("Employee Already exists");
      }

      // Check if approver id is valid in case of non-admin employees
      if(employeeRequest.role !== "admin") {
        let approver = await this.employeeRepository.findById(employeeRequest.approver)
        if(!approver) throw new Error('Entered approver doesn\'t exist')
      }
      const leaveTypes = await this.leaveTypeRepository.find()
      employeeRequest.leaves = leaveTypes;
      const result = await this.employeeRepository.create(employeeRequest);

      return result;
    } catch (err) {
      console.log(err.toString());
      throw { status: 400, message: err.toString() }
    }
  }

  @put('/employee/{id}', {
    responses: {
      '204': {
        description: 'Employee PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Employee, {
            exclude: ['id'],
          }),
        },
      },
    }) employee: Employee,
  ): Promise<void> {
    await this.employeeRepository.replaceById(id, employee);
  }
}
