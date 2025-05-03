import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from 'src/environments/environment';
import { Asignatura } from '../modelos/asignatura.interface';

@Injectable({
    providedIn: 'root'
})
export class AsignaturaApiService {

    constructor(
        private readonly httpCliente: HttpClient,
    ) { }

    ruta = '/asignatura';

    /* ================================================================================================== */
    /* ====================================== CREAR UNA ASIGNATURA ====================================== */
    /* ================================================================================================== */

    crearUnaAsignatura(asignatura: Asignatura) {
        const url = apiUrl + `${this.ruta}/crearUnaAsignatura`;
        return this.httpCliente.post(url, asignatura);
    }

    /* ================================================================================================ */
    /* ====================================== VARIAS ASIGNATURAS ====================================== */
    /* ================================================================================================ */

    crearVariasAsignaturas(archivo: File) {
        const url = apiUrl + `${this.ruta}/crearVariasAsignaturas`;

        const formData = new FormData();
        formData.append('archivoAsignaturas', archivo);

        return this.httpCliente.post(url, formData);
    }


    /* ================================================================================================== */
    /* =================================== ACTUALIZAR UNA ASIGNATURA ==================================== */
    /* ================================================================================================== */

    actualizarAsignaturaPorID(id: string, asignatura: Asignatura) {
        const url = apiUrl + `${this.ruta}/actualizarAsignaturaPorID/${id}`;
        return this.httpCliente.put(url, asignatura);
    }

    /* ================================================================================================== */
    /* ==================================== ELIMINAR UNA ASIGNATURA ===================================== */
    /* ================================================================================================== */

    eliminarAsignaturaPorID(id: string) {
        const url = apiUrl + `${this.ruta}/eliminarAsignaturaPorID/${id}`;
        return this.httpCliente.delete(url);
    }

    /* ==================================================================================== */
    /* ============================= OBTENER UNA ASIGNATURA =============================== */
    /* ==================================================================================== */

    obtenerAsignaturaPorCodigo(codigo: string) {
        const url = apiUrl + `${this.ruta}/obtenerAsignaturaPorCodigo/${codigo}`;
        return this.httpCliente.get(url);
    }

    obtenerAsignaturaPorID(id: string) {
        const url = apiUrl + `${this.ruta}/obtenerAsignaturaPorID/${id}`;
        return this.httpCliente.get(url);
    }

    /* ================================================================================================== */
    /* ================================= OBTENER TODAS LAS ASIGNATURAS ================================== */
    /* ================================================================================================== */

    obtenerAsignaturas() {
        const url = apiUrl + `${this.ruta}/obtenerAsignaturas`;
        return this.httpCliente.get(url);
    }


}