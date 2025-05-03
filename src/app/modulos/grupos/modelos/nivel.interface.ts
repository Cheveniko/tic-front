export interface Nivel {
    id?: string,
    nombre?: string,
    grupos?: any,
    carrera?: any,
}

export interface CrearNivel {
    nombre: string,
    idCarrera: string,
}