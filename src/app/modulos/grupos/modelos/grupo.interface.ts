import { Nivel } from "./nivel.interface"

export interface Grupo {
    id?: string,
    nombre: string,
    idGrupo?: string
    nivel?: Nivel
}

export interface CrearGrupo {
    nombre: string,
    idNivel: string,
}