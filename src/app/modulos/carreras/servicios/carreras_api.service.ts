import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from 'src/environments/environment';
import { Carrera } from '../modelos/carrera.interface';

@Injectable({
    providedIn: 'root'
})
export class CarreraApiService {

    constructor(
        private readonly httpCliente: HttpClient,
    ) { }

    ruta = '/carrera';

    /* =============================================================================================== */
    /* ====================================== CREAR UNA CARRERA ====================================== */
    /* =============================================================================================== */

    crearUnCarrera(carrera: Carrera) {
        const url = apiUrl + `${this.ruta}/crearUnaCarrera`;
        return this.httpCliente.post(url, carrera);
    }


    /* =============================================================================================== */
    /* =================================== ACTUALIZAR UNA CARRERA ==================================== */
    /* =============================================================================================== */

    actualizarCarreraPorID(id: string, carrera: Carrera) {
        const url = apiUrl + `${this.ruta}/actualizarCarreraPorID/${id}`;
        return this.httpCliente.put(url, carrera);
    }

    /* =============================================================================================== */
    /* ==================================== ELIMINAR UNA CARRERA ===================================== */
    /* =============================================================================================== */

    eliminarCarreraPorID(id: string) {
        const url = apiUrl + `${this.ruta}/eliminarCarreraPorID/${id}`;
        return this.httpCliente.delete(url);
    }

    /* =============================================================================================== */
    /* ================================== OBTENER UNA CARRERA ======================================== */
    /* =============================================================================================== */

    obtenerCarreraPorCodigo(codigo: string) {
        const url = apiUrl + `${this.ruta}/obtenerCarreraPorCodigo/${codigo}`;
        return this.httpCliente.get(url);
    }

    obtenerCarreraPorID(id: string) {
        const url = apiUrl + `${this.ruta}/obtenerCarreraPorID/${id}`;
        return this.httpCliente.get(url);
    }

    /* ================================================================================================== */
    /* ================================= OBTENER TODAS LAS CARRERAS ===================================== */
    /* ================================================================================================== */

    obtenerCarreras() {
        const url = apiUrl + `${this.ruta}/obtenerCarreras`;
        return this.httpCliente.get(url);
    }

}