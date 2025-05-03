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

export interface UserData {
    id: string;
    name: string;
}


const NAMES: string[] = [
    'Maia',
    'Asher',
    'Olivia',
    'Atticus',
    'Amelia',
    'Jack',
    'Charlotte',
    'Theodore',
    'Isla',
    'Oliver',
    'Isabella',
    'Jasper',
    'Cora',
    'Levi',
    'Violet',
    'Arthur',
    'Mia',
    'Thomas',
    'Elizabeth',
];

@Component({
    selector: 'app-crear-actividad-dialog',
    templateUrl: './crear-actividad-dialog.component.html',
    styleUrls: ['./crear-actividad-dialog.component.scss']
})
export class CrearActividadDialogComponent implements OnInit, AfterViewInit {

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
    formularioCrearActividad: FormGroup = new FormGroup({});
    semestreEnCurso?: Semestre;

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
        public dialogRef: MatDialogRef<CrearActividadDialogComponent>,
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
        this.crearFormularioCrearActividad();
        this.cargarDatosPrevios();
    }

    private crearFormularioCrearActividad() {
        this.formularioCrearActividad = this.fb.group({
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

    crearActividad() {
        const idAsignatura = this.asignaturaSeleccionada?.id;
        const idDocente = this.docenteSeleccionado?.id;
        const idGrupo = this.grupoSeleccionado?.id;
        const idTipoAula = this.tipoAulaSeleccionada?.id;
        const duracion = this.formularioCrearActividad.get("duracion")?.value;

        const hasValues = idAsignatura && idDocente && idGrupo && idTipoAula && duracion;

        if (hasValues) {
            const actividad = {
                idAsignatura,
                idDocente,
                idGrupo,
                idTipoAula,
                duracion
            }

            Swal.showLoading();
            this.actividadesService.crearUnaActividad(actividad).subscribe(
                {
                    next: () => {
                        Swal.fire({
                            title: 'Se ha registrado correctamente una actividad.',
                            icon: 'success',
                            timer: 9500
                        }).then( () => {
                            this.dialogRef.close();
                        })
                    },
                    error: (error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error al crear actividad',
                            text: error.error.message ? error.error.message : "Ha existido un error al crear la actividad",
                        })
                    }
                }
            )
        }
    }
}



/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
    const name =
        NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
        ' ' +
        NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
        '.';

    return {
        id: id.toString(),
        name: name,
    };
}