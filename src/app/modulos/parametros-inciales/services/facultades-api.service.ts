import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from 'src/environments/environment';
import { Facultad } from '../models/facultad.interface';

@Injectable({
  providedIn: 'root'
})
export class FacultadesApiService {

  private readonly ruta = '/facultades';

  constructor(
    private readonly httpClient: HttpClient,
  ) { }

  obtenerFacultades() : Observable<Facultad[]> {
    const url = apiUrl + `${this.ruta}/obtenerFacultades`;
    return this.httpClient.get<Facultad[]>(url);
  }
}
