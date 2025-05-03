import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Asignatura } from "src/app/modulos/asignaturas/modelos/asignatura.interface";
import { AsignaturaApiService } from "src/app/modulos/asignaturas/servicios/asignaturas_api.service";
import { Docente } from "src/app/modulos/docentes/modelos/docente.interface";
import { DocenteApiService } from "src/app/modulos/docentes/servicios/docentes_api.service";
import Semestre from "src/app/modulos/parametros-inciales/models/semestre.interface";
import { SemestreService } from "src/app/modulos/parametros-inciales/services/semestre-api.service";
import Swal from "sweetalert2";
import { NumeroEstudiantesApiService } from "src/app/modulos/numero-estudiantes/servicios/numeroEstudiantesApi.service";
import { NumeroEstudiantesPorSemestre } from "src/app/modulos/numero-estudiantes/modelos/numeroEstudiantesPorSemestre.interface";
import { TiposAulasApiService } from "src/app/modulos/parametros-inciales/services/tipos-aulas-api.service";
import { TipoAula } from "src/app/modulos/parametros-inciales/models/tipo-aula.interface";
import { Grupo } from "src/app/modulos/grupos/modelos/grupo.interface";
import { GrupoApiService } from "src/app/modulos/grupos/servicios/grupo_api.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActividadesApiService } from "../../servicios/actividades_api.service";
import { MatDialogRef } from "@angular/material/dialog";
import { ActividadEntity } from "../../modelos/actividad.interface";
import { ActivatedRoute } from "@angular/router";
import { ObtenerEspacioFisico } from "../../modelos/espacios-fisicos.interface";

export interface UserData {
  id: string;
  name: string;
}

@Component({
  selector: 'app-actualizar-actividad',
  templateUrl: './actualizar-actividad.component.html',
  styleUrls: ['./actualizar-actividad.component.scss']
})
export class ActualizarActividadComponent implements OnInit {

  displayedColumns: string[] = ['nombreCompleto'];
  displayedColumnsAsignaturas: string[] = ['asignatura'];
  displayedColumnsGrupos: string[] = ['grupo'];
  displayedColumnsTipoAula: string[] = ['tipoAula'];

  dataSource: MatTableDataSource<Docente>;
  dataSourceAsignaturas: MatTableDataSource<NumeroEstudiantesPorSemestre>;
  dataSourceTipoAulas: MatTableDataSource<TipoAula>;
  dataSourceGrupos: MatTableDataSource<Grupo>;
  docentes: Docente[] = [];
  asignaturas: Asignatura[] = [];
  clickedRows = new Set<Docente>();
  docenteSeleccionado?: Docente;
  asignaturaSeleccionada?: NumeroEstudiantesPorSemestre;
  tipoAulaSeleccionada?: TipoAula;
  numeroEstudiantes?: NumeroEstudiantesPorSemestre[];
  grupoSeleccionado?: Grupo;
  tiposAulas?: TipoAula[];
  grupos?: Grupo[];
  formularioActualizarActividad: FormGroup = new FormGroup({});
  semestreEnCurso?: Semestre;

  idActividadRuta: string = '';
  actividad: ActividadEntity = {};
  espaciosFisicosDisponibles: ObtenerEspacioFisico[] = []
  mostrarSeccion = true;

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private readonly docentesService: DocenteApiService,
    private readonly semestreService: SemestreService,
    private readonly numeroEstudiantesService: NumeroEstudiantesApiService,
    private readonly actividadesService: ActividadesApiService,
    private readonly tiposAulaService: TiposAulasApiService,
    private readonly gruposService: GrupoApiService,
    private actividadService: ActividadesApiService,
    private route: ActivatedRoute,
    private readonly fb: FormBuilder,
  ) {
    this.cargarDatosPrevios();

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.docentes);
    this.dataSourceAsignaturas = new MatTableDataSource(this.numeroEstudiantes);
    this.dataSourceTipoAulas = new MatTableDataSource(this.tiposAulas);
    this.dataSourceGrupos = new MatTableDataSource(this.grupos);
  }
  ngOnInit(): void {
    this.crearFormularioActualizarActividad();
    this.cargarDatosPrevios();
    this.cargarParametro();
    this.cargarActividad(parseInt(this.idActividadRuta));
  }

  //DATOS DE LA ACTIVIDAD A ACTUALIZAR
  cargarParametro() {
    this.route.params.subscribe(
      (params) => {
        this.idActividadRuta = params['id'];

      }
    )
  }

  cargarActividad(id: number) {
    let actividad: ActividadEntity = {}

    this.actividadService.obtenerActividadporId(id).subscribe({
      next: (data) => {
        actividad = data;
      },
      complete: () => {
        this.actividad = actividad
        console.log(this.actividad.id);
        //
        this.cargarEspaciosFisicos(this.actividad.tipoAula?.id!!)
      }
    })

  }

  cargarEspaciosFisicos(id: string) {
    let espacioFisico: ObtenerEspacioFisico[] = []

    this.actividadService.obtenerEspaciosFisicosPorTipoDeAula(id).subscribe({
      next: (data) => {
        espacioFisico = data;
      },
      complete: () => {
        this.espaciosFisicosDisponibles = espacioFisico
        //console.log(this.espaciosFisicosDisponibles.id);
      }
    })
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

  actualizarActividad() {
    const idActividadRuta = this.actividad.id!!;
    let idDocente = this.docenteSeleccionado?.id ?? '';
    let idAsignatura = this.asignaturaSeleccionada?.asignatura?.id ?? '';
    let idTipoAula = this.tipoAulaSeleccionada?.id ?? '';
    let idGrupo = this.grupoSeleccionado?.id ?? '';
    let duracion = this.formularioActualizarActividad.get("duracion")?.value ?? '';
  
    if (!idDocente) {
     idDocente = this.actividad.docente?.id ?? '';
    }
    if (!idAsignatura) {
      idAsignatura = this.actividad.asignatura?.id ?? '';
    }
    if (!idTipoAula) {
      idTipoAula = this.actividad.tipoAula?.id ?? '';
    }
    if (!idGrupo) {
      idGrupo = this.actividad.grupo?.id ?? '';
    }
    if (!duracion) {
      duracion = this.actividad.duracion;
    }
    

    const hasValues = idAsignatura && idGrupo && duracion;
  
    console.log("Asignatura", this.asignaturaSeleccionada);
    console.log('idAsignatura', this.asignaturaSeleccionada?.asignatura?.id);
  
    if (hasValues) {
      const actividad = {
        idAsignatura,
        idDocente,
        idTipoAula,
        idGrupo,
        duracion
      };
  
      Swal.showLoading();
      console.log(idActividadRuta);
      console.log(actividad);
  
      this.actividadesService.actualizarActividadPorId(idActividadRuta, actividad)
        .subscribe(
          {
            next: () => {
              Swal.fire({
                title: 'Se ha actualizado correctamente una actividad.',
                icon: 'success',
                timer: 9500
              }).then(() => {
  
              })
            },
            error: (error) => {
              Swal.fire({
                icon: 'error',
                title: 'Error al actualizar actividad',
                text: error.error.message ? error.error.message : "Ha existido un error al crear la actividad",
              })
            }
          }
        );
    }
  }

  //CREACION DE FORMULARIO Y CARGA DE DATOS
  private crearFormularioActualizarActividad() {
    this.formularioActualizarActividad = this.fb.group({
      docente: ['', Validators.required],
      tipoAula: ['', Validators.required],
      asignatura: ['', Validators.required],
      grupo: ['', Validators.required],
      duracion: [1, Validators.required],
    })
  }

  cargarSemestreEnCurso() {
    Swal.showLoading();
    this.semestreService.obtenerSemestreConPlanificacionEnProgreso().subscribe({
      next: (semestre) => {
        this.semestreEnCurso = semestre as Semestre;
        this.cargarNumeroEstudiantes();
      },
      error: (res) => {
        console.log("error en cargar el semestre");
      },
      complete: () => {
        Swal.close();
      }
    });
  }

  cargarTiposAula() {
    Swal.showLoading();
    if (this.semestreEnCurso) {
      this.tiposAulaService.obtenerTipoAulas().subscribe({
        next: (data) => {
          this.tiposAulas = data as TipoAula[];
          this.dataSourceTipoAulas = new MatTableDataSource(this.tiposAulas);
          console.log("tiposAulas", this.tiposAulas)
          this.cargarGrupos();
        },
        error: () => {
          this.mostrarMensajeError('No se pudo cargar la información de docentes.');
        },
        complete: () => {
          Swal.close();
        }
      })
    }
  }

  cargarGrupos() {
    Swal.showLoading();
    if (this.semestreEnCurso) {
      this.gruposService.obtenerGrupos().subscribe({
        next: (data) => {
          this.grupos = data as Grupo[];
          this.dataSourceGrupos = new MatTableDataSource(this.grupos);
          console.log("grupos", this.grupos)
        },
        error: () => {
          this.mostrarMensajeError('No se pudo cargar la información de docentes.');
        },
        complete: () => {
          Swal.close();
        }
      })
    }
  }

  cargarNumeroEstudiantes() {
    Swal.showLoading();
    if (this.semestreEnCurso) {
      this.numeroEstudiantesService.obtenerNumeroEstudiantesPorSemestreId(this.semestreEnCurso?.id!!).subscribe({
        next: (data) => {
          this.numeroEstudiantes = data as NumeroEstudiantesPorSemestre[];
          this.dataSourceAsignaturas = new MatTableDataSource(this.numeroEstudiantes);
          this.cargarTiposAula();
        },
        error: () => {
          this.mostrarMensajeError('No se pudo cargar la información de docentes.');
        },
        complete: () => {
          Swal.close();
        }
      })
    }
  }

  cargarDatosPrevios() {
    Swal.showLoading();
    this.docentesService.visualizarDocentes().subscribe({
      next: (data) => {
        this.docentes = data as Docente[];
        this.dataSource = new MatTableDataSource(this.docentes);
        this.cargarSemestreEnCurso();

      },
      error: () => {
        this.mostrarMensajeError('No se pudo cargar la información de docentes.');
      },
      complete: () => {
        Swal.close();
      }
    })
  }

  seleccionarTipoAula(obj: any) {
    this.tipoAulaSeleccionada = obj;
  }

  seleccionarGrupo(obj: any) {
    this.grupoSeleccionado = obj;
  }

  seleccionarDocente(obj: any) {
    this.docenteSeleccionado = obj;
  }

  seleccionarAsignatura(obj: any) {
    this.asignaturaSeleccionada = obj;
  }

  mostrarMensajeError(mensaje: string) {
    Swal.fire({
      title: 'Error',
      text: mensaje,
      showCancelButton: true,
      confirmButtonText: 'Reiniciar página',
      cancelButtonText: 'Cerrar',
      icon: 'error',
    }
    ).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilterAsignaturas(event2: Event) {
    const filterValue = (event2.target as HTMLInputElement).value;
    this.dataSourceAsignaturas.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceAsignaturas.paginator) {
      this.dataSourceAsignaturas.paginator.firstPage();
    }
  }

  applyFilterGrupos(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceGrupos.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceGrupos.paginator) {
      this.dataSourceGrupos.paginator.firstPage();
    }
  }

  applyFilterTiposAulas(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceTipoAulas.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceTipoAulas.paginator) {
      this.dataSourceTipoAulas.paginator.firstPage();
    }
  }

}
