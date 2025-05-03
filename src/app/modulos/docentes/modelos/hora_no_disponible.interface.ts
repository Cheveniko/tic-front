import { Docente } from "../../docentes/modelos/docente.interface";
import JornadaLaboral from "../../parametros-inciales/models/jornada-laboral.interface";
import { SolicitudHoraNoDisponible } from "./solicitudHoraNoDisponible.interface";

export interface HoraNoDisponible {
    id?: string;
    hora_inicio: number;
    // Jornada
    dia?: JornadaLaboral;
    dia_id?: string;
    // Solicitud
    solicitud?: SolicitudHoraNoDisponible;
}
export interface CrearHoraNoDisponible {
    jornada_id: string;
    docente_id: string;
    hora_inicio: number;
}