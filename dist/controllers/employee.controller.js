"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("@loopback/repository");
const repositories_1 = require("../repositories");
const repositories_2 = require("../repositories");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
// Uncomment these imports to begin using these cool features!
// import {inject} from '@loopback/context';
let EmployeeController = class EmployeeController {
    constructor(employeeRepository, leaveTypeRepository) {
        this.employeeRepository = employeeRepository;
        this.leaveTypeRepository = leaveTypeRepository;
    }
    async create(employeeRequest) {
        try {
            const filterBuilder = new repository_1.FilterBuilder();
            //validate employee schema
            await models_1.Employee.validate(employeeRequest);
            // Validate if the provided email already exists
            const filter = filterBuilder
                .fields("email")
                .where({ email: employeeRequest.email }).build();
            const email = await this.employeeRepository.findOne(filter);
            if (email) {
                throw new Error("Employee Already exists");
            }
            // Check if approver id is valid in case of non-admin employees
            if (employeeRequest.role !== "admin") {
                let approver = await this.employeeRepository.findById(employeeRequest.approver);
                if (!approver)
                    throw new Error('Entered approver doesn\'t exist');
            }
            const leaveTypes = await this.leaveTypeRepository.find();
            employeeRequest.leaves = leaveTypes;
            const result = await this.employeeRepository.create(employeeRequest);
            return result;
        }
        catch (err) {
            console.log(err.toString());
            throw { status: 400, message: err.toString() };
        }
    }
};
__decorate([
    rest_1.post('/employee', {
        responses: {
            '200': {
                description: 'Employee model instance',
                content: { 'application/json': { schema: rest_1.getModelSchemaRef(models_1.Employee) } },
            },
        }
    }),
    __param(0, rest_1.requestBody({
        content: {
            'application/json': {
                schema: rest_1.getModelSchemaRef(models_1.Employee, {
                    exclude: ['id', 'leaves'],
                }),
            },
        },
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.Employee]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "create", null);
EmployeeController = __decorate([
    __param(0, repository_1.repository(repositories_1.EmployeeRepository)),
    __param(1, repository_1.repository(repositories_2.LeaveTypeRepository)),
    __metadata("design:paramtypes", [repositories_1.EmployeeRepository,
        repositories_2.LeaveTypeRepository])
], EmployeeController);
exports.EmployeeController = EmployeeController;
//# sourceMappingURL=employee.controller.js.map