import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from 'src/environments/environment';
import { CrearHoraNoDisponible, HoraNoDisponible } from '../modelos/hora_no_disponible.interface';
import { SolicitudHoraNoDisponible } from '../modelos/solicitudHoraNoDisponible.interface';
import { ObtenerHoraNoDisponible } from '../modelos/horaSemana.interface';

@Injectable({
  providedIn: 'root'
})
export class HorasNoDisponiblesApiService {

  constructor(
    private readonly httpClient: HttpClient,
  ) { }

  ruta = '/horas_no_disponibles';

  solicitarHorasNoDisponibles(idDocente: string, horas_no_disponibles: HoraNoDisponible[]) {
    const url = apiUrl + `${this.ruta}/solicitarHorasNoDisponibles/${idDocente}`;
    return this.httpClient.post(url, horas_no_disponibles);
  }

  //Metodo enviar datos a la ruta y crear un horaDIa No disponible
  crearHoraDiaNoDisponible(datosAEnviar: CrearHoraNoDisponible){
    const url = apiUrl + `${this.ruta}/hora_dia_noDisponible`;
    return this.httpClient.post(url, datosAEnviar);
  }

  //Metodo get para obtener hora/dia NO disponibles
  obtenerHoraDiaNoDisponiblePorIdDocente(idDocente: string){
    const url = apiUrl + `${this.ruta}/horas_dias_noDisponibles/${idDocente}`;
    return this.httpClient.get<ObtenerHoraNoDisponible[]>(url)
  }

  obtenerHorasNoDisponiblesSolicitadasPorDocenteId(id: string) {
    const url = apiUrl + `${this.ruta}/obtenerHorasNoDisponiblesSolicitadasPorDocenteId/${id}`;
    return this.httpClient.get<HoraNoDisponible[]>(url);
  }

  obtenerSolicitudesDelSemestreEnProgreso() {
    const url = apiUrl + `${this.ruta}/obtenerSolicitudesDelSemestreEnProgreso`;
    return this.httpClient.get<SolicitudHoraNoDisponible[]>(url);
  }

  eliminarHorasNoDisponiblesPorDocenteId(id: string) {
    const url = apiUrl + `${this.ruta}/eliminarHoras/${id}`;
    return this.httpClient.delete(url);
  }

  aprobarSolicitudHorasNoDisponiblesPorDocenteId(id: string) {
    const url = apiUrl + `${this.ruta}/aprobarSolicitudHorasNoDisponiblesPorDocenteId/${id}`;
    return this.httpClient.get(url);
  }

  rechazarSolicitudHorasNoDisponiblesPorDocenteId(id: string) {
    const url = apiUrl + `${this.ruta}/rechazarSolicitudHorasNoDisponiblesPorDocenteId/${id}`;
    return this.httpClient.get(url);
  }


}