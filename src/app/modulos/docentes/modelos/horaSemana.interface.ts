export enum DISPONIBILIDAD {
    NO_DISPONIBLE = 'NO_DISPONIBLE',
    ALMUERZO = 'ALMUERZO',
    DISPONIBLE = 'DISPONIBLE',
    OCUPADO_POR_ACTIVIDAD = 'OCUPADO_POR_ACTIVIDAD'
}

export interface HoraSemana {
    hora: number;
    rangoHoras: string;
    "LUNES": DISPONIBILIDAD;
    "MARTES": DISPONIBILIDAD;
    "MIÉRCOLES": DISPONIBILIDAD;
    "JUEVES": DISPONIBILIDAD;
    "VIERNES": DISPONIBILIDAD;
    "SÁBADO": DISPONIBILIDAD;
    "DOMINGO": DISPONIBILIDAD;
}

export interface ObtenerHoraNoDisponible {
    idHoraNoDisponible: string;
    idJornada: string;
    dia: string;
    hora_inicio: number;
}