import { Asignatura } from "../../asignaturas/modelos/asignatura.interface";
import { Docente } from "../../docentes/modelos/docente.interface";
import { Grupo } from "../../grupos/modelos/grupo.interface";
import { TipoAula } from "../../parametros-inciales/models/tipo-aula.interface";

export interface CrearActividad {
    idTipoAula?: string;
    idDocente?: string;
    idAsignatura?: string;
    idGrupo?: string;
    duracion?: number;
}

export interface Actividad {
    idAula?: string;
    idTipoAula?: string;
    idDocente?: string;
    idAsignatura?: string;
    idGrupo?: string;
    duracion?: number;
}

//
export interface ActividadEntity{
    id?: number;
    estado?: boolean;
    duracion?: number;
    numeroEstudiantes?: number;
    docente?: Docente;
    tipoAula?: TipoAula;
    asignatura?: Asignatura;
    grupo?: Grupo;
}

export interface ActualizarActividad{
    idAsignatura: string;
    idGrupo: string;
    duracion: number;
}

//Interfaz para restricciones docente
export interface ObtenerRestriccionesDocente{
    dia: string,
    hora_inicio: number,
    idActividad: number
}
