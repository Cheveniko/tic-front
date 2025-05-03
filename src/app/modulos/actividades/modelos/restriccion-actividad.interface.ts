export interface CrearRestriccion{
    idActividad ?: number,
    idEspacioFisico?: string
    dia ?: string,
    hora ?: string
}

export interface obtenerRestriccion{
    idRestriccion: number,
    idEspacioFisico: string,
    espacioFisico: string,
    dia: string,
    hora: string
}

export interface eliminarRestriccion{
    id: number,
    dia: string,
    hora: string
}