import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { apiUrl } from "src/environments/environment";
import Semestre from "../models/semestre.interface";

@Injectable({
  providedIn: "root",
})
export class SemestreService {
  private readonly ruta = "/semestre";
  private readonly semetreURL = `${apiUrl}${this.ruta}`;

  constructor(private readonly httpClient: HttpClient) {}

  obtenerSemestres(): Observable<Semestre[]> {
    return this.httpClient.get<Semestre[]>(
      `${this.semetreURL}/obtenerSemestres`,
    );
  }

  obtenerSemestreConPlanificacionEnProgreso(): Observable<Semestre> {
    return this.httpClient.get<Semestre>(
      `${this.semetreURL}/obtenerSemestreConPlanificacionEnProgreso`,
    );
  }
}
