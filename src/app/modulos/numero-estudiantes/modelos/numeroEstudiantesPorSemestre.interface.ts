import { Asignatura } from "../../asignaturas/modelos/asignatura.interface";
import Semestre from "../../parametros-inciales/models/semestre.interface";

export interface NumeroEstudiantesPorSemestre {
    id?: string,
    // Semestre
    idSemestre?: string,
    semestre?: Semestre,
    // Asignatura
    idAsignatura?: string,
    asignatura?: Asignatura,

    numeroEstudiantes: number,
}