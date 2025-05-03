import { Usuario } from "src/app/servicios/auth/models/usuario.model";

export interface Horario {
    id?: string,
    fechaCreacion?: string,
    horarioJson?: string,
    usuario?: Usuario,
    descripcion?: string
}