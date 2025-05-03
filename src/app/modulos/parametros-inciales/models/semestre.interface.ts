import JornadaLaboral from "./jornada-laboral.interface";

export default interface Semestre {
    id: string,
    abreviatura : string,
    jornadas?: JornadaLaboral[],
}