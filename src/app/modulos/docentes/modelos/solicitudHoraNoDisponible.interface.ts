import { Docente } from "../../docentes/modelos/docente.interface";
import Semestre from "../../parametros-inciales/models/semestre.interface";
import ESTADO_SOLICITUD_HORA_NO_DISPONIBLE from "../enum/estadoSolicitudHoraNoDisponible.enum";

import { HoraNoDisponible } from "./hora_no_disponible.interface";

export interface SolicitudHoraNoDisponible {
    id?: string;
    
    // Docente
    docente_id?: string;
    docente: Docente;
    
    ultimaModificacion: Date;

    // Semestre
    idSemestre?: string;
    semestre?: Semestre;

    estado: ESTADO_SOLICITUD_HORA_NO_DISPONIBLE;

    horasNoDisponibles?: HoraNoDisponible[];
}