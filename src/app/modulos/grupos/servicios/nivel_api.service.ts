import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from 'src/environments/environment';
import { CrearNivel } from '../modelos/nivel.interface';

@Injectable({
    providedIn: 'root'
})
export class NivelApiService {

    constructor(
        private readonly httpCliente: HttpClient,
    ) { }

    ruta = '/nivel'

    obtenerNivelesPorCarrera(idCarrera: string) {
        const url = apiUrl + `${this.ruta}/obtenerNivelesPorCarrera/${idCarrera}`
        return this.httpCliente.get(url);
    }

    crearNivel(nivel: CrearNivel) {
        const url = apiUrl + `${this.ruta}/crearNivel`
        return this.httpCliente.post(url, nivel);
    }
}