import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { apiUrl } from 'src/environments/environment';
import { TipoAula, TipoAulaPorCrear } from '../models/tipo-aula.interface';

@Injectable({
  providedIn: 'root'
})
export class TiposAulasApiService {
  
  private readonly ruta = '/tipoAula';

  constructor(
    private readonly httpClient: HttpClient,
  ) { }

  actualizarTipoAula(tipoAula: any, id: string) {
    const url = apiUrl + `${this.ruta}/actualizarTipoAula/${id}`;
    return this.httpClient.put(url, tipoAula);
  }

  crearTipoAula(tipoAula: TipoAulaPorCrear) {
    const url = apiUrl + `${this.ruta}/crearTipoAula`;
    return this.httpClient.post(url, tipoAula)
  }

  eliminarTipoAula(id: string) {
    const url = apiUrl + `${this.ruta}/eliminarTipoAula/${id}`;
    console.log(url);
    return this.httpClient.delete(url);
  }

  obtenerTipoAulas(): Observable<TipoAula[]> {
    const url = apiUrl + `${this.ruta}/obtenerTipoAulas`;
    return this.httpClient.get<TipoAula[]>(url);
  }
}
