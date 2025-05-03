import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from 'src/environments/environment';
import { EspacioFisico } from '../modelos/espacio_fisico.interface';

@Injectable({
  providedIn: 'root'
})
export class EspaciosFisicosApiService {

  constructor(
    private readonly httpClient: HttpClient,
  ) { }

  ruta = '/espacios_fisicos';

  /* Create */
  crearEspacioFisico(espacioFisico: EspacioFisico) {
    const url = apiUrl + `${this.ruta}/crearUno`;
    return this.httpClient.post(url, espacioFisico);
  }

  crearMultiplesEspaciosFisicos(archivo: File) {
    const url = apiUrl + `${this.ruta}/crearMultiples`;

    const formData = new FormData();
    formData.append('archivoEspaciosFisicos', archivo);

    return this.httpClient.post(url, formData);
  }

  /* Read */
  obtenerEspaciosFisicos() {
    const url = apiUrl + `${this.ruta}/obtenerEspaciosFisicos`;
    return this.httpClient.get<EspacioFisico[]>(url);
  }

  obtenerEspacioFisicoPorId(id: string) {
    const url = apiUrl + `${this.ruta}/obtenerEspaciosFisicos/${id}`;
    return this.httpClient.get<EspacioFisico>(url);
  }

  /* Update */
  actualizarEspacioFisicoPorId(id: string, espacioFisicoActualizado: EspacioFisico) {
    const url = apiUrl + `${this.ruta}/actualizarEspacioFisico/${id}`;
    return this.httpClient.put(url, espacioFisicoActualizado);
  }

  /* Delete */
  eliminarEspacioFisico(id: string) {
    const url = apiUrl + `${this.ruta}/eliminarEspacioFisico/${id}`;
    return this.httpClient.delete(url);
  }
  
}
