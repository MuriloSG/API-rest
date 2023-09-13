import { RolesRepository } from '@roles/repositories/RolesRepository'
import { ShowRoleUseCase } from './ShowRoleUseCase'
import { ShowRoleController } from './showRoleController'

const rolesRepository = RolesRepository.getInstance()
const showRoleUseCase = new ShowRoleUseCase(rolesRepository)
export const showRolesController = new ShowRoleController(showRoleUseCase)
