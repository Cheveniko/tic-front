import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { apiUrl } from "src/environments/environment";
import { Actividad, ActividadEntity, ActualizarActividad, CrearActividad, ObtenerRestriccionesDocente } from "../modelos/actividad.interface";
import { ObtenerEspacioFisico } from "../modelos/espacios-fisicos.interface";
import { CrearRestriccion, eliminarRestriccion, obtenerRestriccion } from "../modelos/restriccion-actividad.interface";

@Injectable({
    providedIn: 'root'
})
export class ActividadesApiService {

    constructor(
        private readonly httpCliente: HttpClient,
    ) { }

    ruta = "/actividades";

    crearUnaActividad(actividad: CrearActividad) {
        const url = apiUrl + `${this.ruta}/crearUnaActividad`;
        return this.httpCliente.post(url, actividad);
    }

    // Crear una restriccion para la actividad actual
    crearUnaRestriccion(restriccion:CrearRestriccion){
        const url = apiUrl + `${this.ruta}/crearRestriccion`;
        return this.httpCliente.post(url, restriccion)
    }

    obtenerActividades() {
        const url = apiUrl + `${this.ruta}/obtenerActividades`;
        return this.httpCliente.get(url);
    }
    
    // Obtener una actividad especifica
    obtenerActividadporId(id:number){
        const url = apiUrl + `${this.ruta}/obtenerActividad/${id}`;
        return this.httpCliente.get<ActividadEntity>(url);
    }

    //
    eliminarActividadPorId(id:number){
        const url =apiUrl + `${this.ruta}/eliminarActividadPorId/${id}`;
        return this.httpCliente.delete<ActividadEntity>(url);
    }

    //
    actualizarActividadPorId(id:number, nuevaActividad:ActualizarActividad){
        const url =apiUrl + `${this.ruta}/actualizarActividadPorId/${id}`;
        return this.httpCliente.put<ActividadEntity>(url,nuevaActividad);
    }

    obtenerEspaciosFisicosPorTipoDeAula(id:string){
        const url =apiUrl + `/espacios_fisicos/obtenerEspaciosFisicoPorTipoDeAula/${id}`;
        return this.httpCliente.get<ObtenerEspacioFisico[]>(url);
    }

    obtenerRestriccionesPorId(id:number){
        const url =apiUrl + `${this.ruta}/obtenerRestriccionesPorId/${id}`;
        return this.httpCliente.get<obtenerRestriccion[]>(url);
    }

    //metodo para llamar el metodo desde la URL
    obtenerRestriccionesDelDocentePorID(id: string){
        const url = apiUrl + `${this.ruta}/obtenerRestriccionesDelDocentePorId/${id}`;
        return this.httpCliente.get<ObtenerRestriccionesDocente[]>(url);
    }

    eliminarRestriccionPorId(id:number){
        const url =apiUrl + `${this.ruta}/eliminarRestriccionPorId/${id}`;
        return this.httpCliente.delete<eliminarRestriccion>(url);
    }

    

}