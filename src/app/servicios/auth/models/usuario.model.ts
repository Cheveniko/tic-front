import { RolesEnum } from "../enum/roles.enum";

export interface Usuario {
    correo: string,
    roles: RolesEnum[]
}