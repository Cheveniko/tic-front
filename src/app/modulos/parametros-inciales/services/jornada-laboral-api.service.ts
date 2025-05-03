import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { apiUrl } from "src/environments/environment";
import JornadaLaboral from "../models/jornada-laboral.interface";


@Injectable({
    providedIn: 'root'
})
export class JornadaLaboralApiService {

    private readonly ruta = '/jornadaLaboral';

    constructor(
        private readonly httpClient: HttpClient,
    ) { }

    crearJornadaLaboral(jornada : JornadaLaboral){
        const url = apiUrl + `${this.ruta}/crearJornadaLaboral`;
        return this.httpClient.post(url, jornada);
    }

    obtenerJornadaLaboralPorSemestre(idSemestre: string): Observable<JornadaLaboral[]>{
        const url = apiUrl + `${this.ruta}/obtenerJornadaLaboralPorSemestre/${idSemestre}`;
        return this.httpClient.get<JornadaLaboral[]>(url);
    }
}