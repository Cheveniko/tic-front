import { Facultad } from "./facultad.interface";

export interface TipoAula {
  id?: string;
  tipo: string;
  facultad: Facultad;
}

export interface TipoAulaPorCrear {
  tipo: string;
  idFacultad: string;
}