import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ActividadesApiService } from '../../servicios/actividades_api.service';
import { ActividadEntity } from '../../modelos/actividad.interface';
import { ObtenerEspacioFisico } from '../../modelos/espacios-fisicos.interface';
import Swal from 'sweetalert2';
import { obtenerRestriccion } from '../../modelos/restriccion-actividad.interface';
import { MatTableDataSource } from '@angular/material/table';
import { Usuario } from 'src/app/servicios/auth/models/usuario.model';
import { UsuarioStorageService } from 'src/app/servicios/auth/usuario-storage.service';
import { RolesEnum } from 'src/app/servicios/auth/enum/roles.enum';

@Component({
  selector: 'app-restriccion-lugar-tiempo',
  templateUrl: './restriccion-lugar-tiempo.component.html',
  styleUrls: ['./restriccion-lugar-tiempo.component.scss']
})
export class RestriccionLugarTiempoComponent implements OnInit {

  formularioRestriccionesLugarTiempo: FormGroup = new FormGroup({});
  idActividadRuta:string='';
  actividad : ActividadEntity = {};
  espaciosFisicosDisponibles: ObtenerEspacioFisico[] = []
  espacioFisicoSeleccionado?:ObtenerEspacioFisico = { id:'', nombre:'', aforo: 0}
  diasLaborables: string[] = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
  horasDisponibles: string[]= this.cargarHorasDisponibles();

  restriccionesPorActividad :obtenerRestriccion[] = [];

   //Rol de usuarios
   usuario?: Usuario;

  constructor(
    private route:ActivatedRoute, 
    private readonly usuarioService: UsuarioStorageService,
    private actividadService:ActividadesApiService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.cargarParametro();
    this.cargarActividad(parseInt(this.idActividadRuta));
    this.cargarFormulario();
  }

  cargarFormulario(){
    const espacioFisicoInicial = this.restriccionesPorActividad.length ? this.restriccionesPorActividad[0].espacioFisico : "";

    // Busco el objeto
    const espacioFisicoInicialObject = this.espaciosFisicosDisponibles.filter(e => e.nombre === espacioFisicoInicial)

    this.formularioRestriccionesLugarTiempo = this.formBuilder.group({
      espacioFisico:[this.espaciosFisicosDisponibles.length ? espacioFisicoInicialObject[0]: "",[Validators.required]],
      dia:[this.restriccionesPorActividad.length ? this.restriccionesPorActividad[0].dia: "",[Validators.required]],
      hora:[this.restriccionesPorActividad.length ? this.restriccionesPorActividad[0].hora: "",[Validators.required]]
    });
    
    console.log("Espacio fisico:", espacioFisicoInicial)
    //console.log("idRestricciòn:", this.restriccionesPorActividad.length ? this.restriccionesPorActividad[0].idRestriccion:"");
  }


  cargarParametro(){
    this.route.params.subscribe(
      (params)=>{
        this.idActividadRuta = params['id'];
      }
    )
  }

  cargarActividad(id:number){
    let actividad: ActividadEntity = {} 

    this.actividadService.obtenerActividadporId(id).subscribe({
      next: (data)=>{
        actividad = data;
      },
      complete: ()=>{
        this.actividad = actividad
        this.cargarEspaciosFisicos(this.actividad.tipoAula?.id!!)
      }
    })
  
  }

  cargarEspaciosFisicos(id:string){
    this.actividadService.obtenerEspaciosFisicosPorTipoDeAula(id).subscribe({
      next: (data)=>{
        this.espaciosFisicosDisponibles = data;
      },
      complete: ()=>{
        this.cargarRestricciones(parseInt(this.idActividadRuta))
      }
    })
  }

  seleccionarEspacio(){

  }

  cargarHorasDisponibles(): string[] {
    const rangosDeTiempo: string[] = [];

    for (let hora = 7; hora <= 21; hora++) {
        const startTime = `${hora}:00`;
        const endTime = `${hora + 1}:00`;
        const timeRange = `${startTime}-${endTime}`;
        rangosDeTiempo.push(timeRange);
    }

    return rangosDeTiempo;
  }

  crearRestriccion(){
    const restriccion = {
      idActividad: parseInt(this.idActividadRuta),
      idEspacioFisico: this.formularioRestriccionesLugarTiempo.value.espacioFisico.id,
      dia: this.formularioRestriccionesLugarTiempo.value.dia,
      hora: this.formularioRestriccionesLugarTiempo.value.hora
    };

    Swal.showLoading();
    this.actividadService.crearUnaRestriccion(restriccion).subscribe(
      {
          next: () => {
            
          },
          complete:()=>{
           
            Swal.fire({
              title: 'Se ha agregado correctamente una restriccion.',
              icon: 'success',
              timer: 9500
          }).then( () => {
                ;
            })
            this.cargarRestricciones(parseInt(this.idActividadRuta));
          },
          error: (error) => {
              Swal.fire({
                  icon: 'error',
                  title: 'Error al crear restriccion',
                  text: !error.error.data ? error.error.message : `Restricción ya fue asignada a la actividad: 
                    ${error.error.data.restriccion.actividad.id} - ${error.error.data.restriccion.actividad.docente.nombreCompleto}`
              })
          }
      }
    )
  }

  cargarRestricciones(idActividad:number){
    this.actividadService
      .obtenerRestriccionesPorId(idActividad)
      .subscribe({
        next: (data)=>{
          this.restriccionesPorActividad = data;
        },
        complete:()=>{          
          this.cargarFormulario()
        }
    }) 
  }

  eliminarRestriccion(){
    Swal.fire({
      title: 'Esta seguro de eliminar esta restricción?',
      text: "No se podrá revertir estos cambios!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const idRestriccion = this.restriccionesPorActividad[0].idRestriccion;
        console.log("idRestriccion",idRestriccion)
        this.actividadService
          .eliminarRestriccionPorId(idRestriccion)
          .subscribe({
            next:()=>{
              console.log("Test eliminar")
            },
            complete:()=>{
              this.cargarRestricciones(parseInt(this.idActividadRuta));
              Swal.fire(
                'Restricción eliminada!',
                'Se ha eliminado correctamente la restricción',
                'success'
              )
            },
            error:(error)=>{
              this.cargarRestricciones(parseInt(this.idActividadRuta));
              Swal.fire({
                icon: 'error',
                title: 'Error al eliminar restriccion',
              })
            }
          })
      }
    })
  }

  //Verificaciòn de rol
  esCoordinador() {
    return this.usuarioService.obtenerRoles().includes(RolesEnum.COORDINADOR);
  }

  esAsistenteAcademico() {
    return this.usuarioService.obtenerRoles().includes(RolesEnum.ASISTENTE_ACADEMICO);
  }

}
