import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from 'src/environments/environment';
import { Docente } from '../modelos/docente.interface'

@Injectable({
    providedIn: 'root'
})
export class DocenteApiService {

    constructor(
        private readonly httpCliente: HttpClient,
    ) { }

    ruta = '/docente';

    /* ================================================================ */
    /* ======================= CREAR UN DOCENTE ======================= */
    /* ================================================================ */

    crearUnDocente(docente: Docente) {
        const url = apiUrl + `${this.ruta}/crearUnDocente`;
        return this.httpCliente.post(url, docente);
    }

    /* ================================================================ */
    /* ===================== CREAR VARIOS DOCENTE ===================== */
    /* ================================================================ */

    crearVariosDocentes(archivo: File) {
        const url = apiUrl + `${this.ruta}/crearVariosDocentes`;

        const formData = new FormData();
        formData.append('archivoDocentes', archivo);

        return this.httpCliente.post(url, formData);
    }

    /* ================================================================ */
    /* ====================== ACTUALIZAR DOCENTE ====================== */
    /* ================================================================ */

    actualizarDocentePorID(id: string, docente: Docente) {
        const url = apiUrl + `${this.ruta}/actualizarDocentePorID/${id}`;
        return this.httpCliente.put(url, docente);
    }

    /* ================================================================ */
    /* ======================= ELIMINAR DOCENTE ======================= */
    /* ================================================================ */

    eliminarDocentePorID(id: string) {
        const url = apiUrl + `${this.ruta}/eliminarDocentePorID/${id}`;
        return this.httpCliente.delete(url);
    }

    /* ================================================================ */
    /* ===================== VISUALIZAR DOCENTES ====================== */
    /* ================================================================ */

    visualizarDocentes() {
        const url = apiUrl + `${this.ruta}/obtenerDocentes`;
        return this.httpCliente.get(url);
    }

    /* ================================================================ */
    /* ==================== VISUALIZAR UN DOCENTE ===================== */
    /* ================================================================ */

    visualizarDocentesPorID(id: string) {
        const url = apiUrl + `${this.ruta}/obtenerDocentePorID/${id}`;
        return this.httpCliente.get(url);
    }

    visualizarDocentePorCorreoElectronico(correo: string) {
        const url = apiUrl + `${this.ruta}/obtenerDocentePorCorreoElectronico/${correo}`;
        return this.httpCliente.get<Docente>(url);
    }
}
