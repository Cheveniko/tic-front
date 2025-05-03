import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from 'src/environments/environment';
import { CrearGrupo } from '../modelos/grupo.interface';

@Injectable({
    providedIn: 'root'
})
export class GrupoApiService {

    constructor(
        private readonly httpCliente: HttpClient,
    ) { }

    ruta = '/grupo'

    obtenerGrupos() {
        const url = apiUrl + `${this.ruta}/obtenerTodosLosGrupos`;
        return this.httpCliente.get(url);
    }

    crearGrupo(grupo: CrearGrupo) {
        const url = apiUrl + `${this.ruta}/crearGrupo`;
        return this.httpCliente.post(url, grupo);
    }

    obtenerGruposPorIdNivel(idNivel: string) {
        const url = apiUrl + `${this.ruta}/obtenerGruposPorIdNivel/${idNivel}`;
        return this.httpCliente.get(url);
    }
}