import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { Carrera } from 'src/app/modulos/carreras/modelos/carrera.interface';
import { CarreraApiService } from 'src/app/modulos/carreras/servicios/carreras_api.service';
import Swal from 'sweetalert2';
import { Grupo } from '../../modelos/grupo.interface';
import { Nivel } from '../../modelos/nivel.interface';
import { GrupoApiService } from '../../servicios/grupo_api.service';
import { NivelApiService } from '../../servicios/nivel_api.service';
import { CrearGrupoDialogComponent } from '../crear-grupo-dialog/crear-grupo-dialog.component';
import { UsuarioStorageService } from 'src/app/servicios/auth/usuario-storage.service';
import { Usuario } from 'src/app/servicios/auth/models/usuario.model';
import { RolesEnum } from 'src/app/servicios/auth/enum/roles.enum';

@Component({
    selector: 'app-mostrar-grupos',
    templateUrl: './mostrar-grupos.component.html',
    styleUrls: ['./mostrar-grupos.component.scss']
})
export class MostrarGruposComponent implements OnInit, AfterViewInit {

    carreras: Carrera[] = [];
    niveles: Nivel[] = [];
    grupos: Grupo[] = [];
    carreraSeleccionada?: Carrera;
    nivelSeleccionado?: Nivel;

    //Rol de usuarios
    usuario?: Usuario;

    constructor(
        public dialog: MatDialog,
        private readonly usuarioService: UsuarioStorageService,
        private readonly carreraService: CarreraApiService,
        private readonly nivelesService: NivelApiService,
        private readonly gruposService: GrupoApiService,
    ) { }

    cargarCarreras() {
        Swal.showLoading();
        this.carreraService.obtenerCarreras()
            .subscribe({
                next: (data) => {
                    const carreras = data as Carrera[];
                    this.carreras = carreras;
                },
                error: (Err) => {
                    console.log("error: ", Err)
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudieron obtener los registros.',
                        showCancelButton: true,
                        confirmButtonText: 'Reiniciar página',
                        cancelButtonText: 'Cerrar',
                        icon: 'error',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                    });
                },
                complete: () => {
                    console.log(this.carreras);
                    // this.carreras.data = this.carreras;
                    Swal.close();
                }
            });
    }

    ngAfterViewInit(): void {
        //throw new Error('Method not implemented.');
    }

    ngOnInit(): void {
        this.cargarCarreras();
    }


    seleccionarSemestre(event: any) {
        const idSemestre = event.options[0]._value.id;
        this.carreraSeleccionada = event.options[0]._value as Carrera;
        this.cargarNiveles(idSemestre);
    }

    seleccionarNivel(event: any) {
        const idSemestre = event.options[0]._value.id;
        this.nivelSeleccionado = event.options[0]._value as Nivel;
        this.cargarGrupos(this.nivelSeleccionado.id!!);
    }

    cargarGrupos(idNivel: string) {
        Swal.showLoading();
        this.gruposService.obtenerGruposPorIdNivel(idNivel)
            .subscribe({
                next: (data) => {
                    const grupos = data as Grupo[];
                    this.grupos = grupos;
                },
                error: (Err) => {
                    console.log("error: ", Err)
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudieron obtener los registros.',
                        showCancelButton: true,
                        confirmButtonText: 'Reiniciar página',
                        cancelButtonText: 'Cerrar',
                        icon: 'error',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                    });
                },
                complete: () => {
                    console.log("niveles", this.niveles);
                    // this.carreras.data = this.carreras;
                    Swal.close();
                }
            });

    }

    cargarNiveles(idCarrera: string) {
        Swal.showLoading();
        this.nivelesService.obtenerNivelesPorCarrera(idCarrera)
            .subscribe({
                next: (data) => {
                    const niveles = data as Nivel[];
                    this.niveles = niveles;
                    console.log('Niveeles --->', niveles)
                },
                error: (Err) => {
                    console.log("error: ", Err)
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudieron obtener los registros.',
                        showCancelButton: true,
                        confirmButtonText: 'Reiniciar página',
                        cancelButtonText: 'Cerrar',
                        icon: 'error',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                    });
                },
                complete: () => {
                    console.log("niveles", this.niveles);
                    // this.carreras.data = this.carreras;
                    Swal.close();
                }
            });
    }

    abrirCrearGrupoAulaDialog() {
        const dialogRef = this.dialog.open(CrearGrupoDialogComponent, {
            width: '30rem',
            data: {
                carreras: this.carreras,
            }
        })

        dialogRef.afterClosed().subscribe(result => {
            if (this.nivelSeleccionado) {
                this.cargarGrupos(this.nivelSeleccionado.id!!);
            }
            //  TODO:  this.obtenerTipoAulas();
        })
    }

    mostrarNivelesACrear(numeroNiveles: number, codigoCarrera: string) {
        let mensaje = "";
        for (let index = 1; index <= numeroNiveles; index++) {
            mensaje += `Nivel ${index} - ${codigoCarrera}${index === numeroNiveles ? '.' : ', '} `
        }
        return mensaje;
    }

    crearNiveles() {
        Swal.fire({
            title: 'Creación de niveles',
            text: `Se crearán los siguientes niveles: \n
            ${this.mostrarNivelesACrear(
                this.carreraSeleccionada?.duracion!!,
                this.carreraSeleccionada?.codigo!!
            )
                }
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Crear niveles'
        }).then(async (result) => {

            if (result.isConfirmed) {
                Swal.showLoading();
                try {
                    for (let index = 1; index <= this.carreraSeleccionada?.duracion!!; index++) {
                        Swal.showLoading();
                        console.log({
                            idCarrera: this.carreraSeleccionada?.id!!,
                            nombre: `Nivel ${index} - ${this.carreraSeleccionada?.codigo!!}`,
                        })
                        await lastValueFrom(this.nivelesService.crearNivel({
                            idCarrera: this.carreraSeleccionada?.id!!,
                            nombre: `Nivel ${index} - ${this.carreraSeleccionada?.codigo!!}`,
                        }))
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: `No se ha podido crear los niveles exitosamente para la carrera de ${this.carreraSeleccionada?.nombre}`,
                    })
                }
                Swal.fire(
                    'Operación exitosa',
                    'Se han creado correctamente los niveles para la carrera seleccionada.',
                    'success'
                )
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
