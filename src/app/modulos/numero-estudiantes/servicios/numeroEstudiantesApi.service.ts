import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from 'src/environments/environment';
import { NumeroEstudiantesPorSemestre } from '../modelos/numeroEstudiantesPorSemestre.interface';

@Injectable({
  providedIn: 'root'
})
export class NumeroEstudiantesApiService {

  constructor(
    private readonly httpClient: HttpClient,
  ) { }

  ruta = '/numero_estudiantes_por_semestre';

  registrarNumeroEstudiantesPorSemestre(numeroEstudiantesPorSemestre: NumeroEstudiantesPorSemestre[]) {
    const url = apiUrl + `${this.ruta}/registrarNumeroEstudiantesPorSemestre`;
    return this.httpClient.post(url, numeroEstudiantesPorSemestre);
  }

  obtenerNumeroEstudiantesPorSemestreId(id: string) {
    const url = apiUrl + `${this.ruta}/obtenerNumeroEstudiantesPorSemestreId/${id}`;
    return this.httpClient.get<NumeroEstudiantesPorSemestre[]>(url);
  }
}
