import { AfterViewInit, Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Carrera } from "src/app/modulos/carreras/modelos/carrera.interface";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from "sweetalert2";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NivelApiService } from "../../servicios/nivel_api.service";
import { Nivel } from "../../modelos/nivel.interface";
import { lastValueFrom } from "rxjs";
import { GrupoApiService } from "../../servicios/grupo_api.service";
import { CrearGrupo } from "../../modelos/grupo.interface";


@Component({
    selector: 'app-crear-grupo',
    templateUrl: './crear-grupo-dialog.component.html',
    styleUrls: ['./crear-grupo-dialog.component.scss']
})
export class CrearGrupoDialogComponent implements OnInit {

    dataCarreras: Carrera[] = [];

    niveles: Nivel[] = []
    carreraSeleccionada?: Carrera;
    nivelSeleccionado?: Nivel;
    carrera?: Carrera;
    formularioCrearGrupo: FormGroup = new FormGroup({});

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<CrearGrupoDialogComponent>,
        private fb: FormBuilder,
        private nivelesService: NivelApiService,
        private gruposService: GrupoApiService

    ) { }

    private crearFormulario() {

        const carreraSoftware = this.dataCarreras.filter(carrera => carrera.codigo.toUpperCase().includes("ISW"))[0];
        if (carreraSoftware) {
            this.carreraSeleccionada = carreraSoftware;
            this.cargarNiveles(this.carreraSeleccionada.id!!);
        }

        const valorInicial = '';
        this.formularioCrearGrupo = this.fb.group({
            carrera: [carreraSoftware || '', [Validators.required]],
            niveles: [valorInicial, [Validators.required]],
            numeroGrupos: [1, [Validators.required, Validators.max(4)]]
        });
    }

    cargarNiveles(idCarrera: string) {
        Swal.showLoading();
        this.nivelesService.obtenerNivelesPorCarrera(idCarrera)
            .subscribe({
                next: (data) => {
                    const niveles = data as Nivel[];
                    this.niveles = niveles;
                },
                complete: () => {
                    Swal.close();
                }
            })
            ;
    }

    seleccionarCarrera() {
        this.cargarNiveles(this.carreraSeleccionada?.id!!);
    }

    mostrarGruposACrear(numeroGrupos: number, codigo: string, semestre: string) {
        let mensaje = ""
        for (let index = 1; index <= numeroGrupos; index++) {
            mensaje += `${semestre}-GR${index}-${codigo}${index === numeroGrupos ? '.' : ', '}`
        }
        return mensaje;
    }

    crearGrupos() {

        const semestre = this.nivelSeleccionado?.nombre!!.charAt(6)!!;
        Swal.fire({
            title: 'Creación de grupos',
            text: `Se crearán los siguientes grupos: \n
                    ${this.mostrarGruposACrear(
                this.formularioCrearGrupo.value.numeroGrupos,
                this.carreraSeleccionada?.codigo!!,
                semestre,
            )
                }
                    `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Crear grupos'
        }).then(async (result) => {

            if (result.isConfirmed) {
                Swal.showLoading();
                try {
                    for (let index = 1; index <= this.formularioCrearGrupo.value.numeroGrupos; index++) {
                        Swal.showLoading();
                        let data: CrearGrupo = {
                            idNivel: this.nivelSeleccionado?.id!!,
                            nombre: `${semestre}-GR${index}-${this.carreraSeleccionada?.codigo!!}`,
                        };
                        await lastValueFrom(this.gruposService.crearGrupo(data))
                        Swal.close();

                    }
                    this.dialogRef.close();
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: `No se ha podido crear los grupos exitosamente para la carrera de ${this.carreraSeleccionada?.nombre}`,
                    })
                }
                Swal.fire(
                    'Operación exitosa',
                    'Se han creado correctamente los grupos para el nivel seleccionado.',
                    'success'
                )
            }
        })


        if (this.formularioCrearGrupo.valid) {
            console.log("this.formularioCrearGrupo.value",
                this.formularioCrearGrupo.value.niveles.id);
            console.log("this.formularioCrearGrupo.value",
                this.formularioCrearGrupo.value.numeroGrupos);
            /*  Swal.showLoading();
              this.nivelesService.crearNivel(idCarrera)
                  .subscribe({
                      next: (data) => {
                          const niveles = data as Nivel[];
                          this.niveles = niveles;
                      },
                      complete: () => {
                          Swal.close();
                      }
                  })
                  ;*/
        }

    }


    ngOnInit() {
        this.dataCarreras = this.data.carreras;

        this.crearFormulario();

        // throw new Error("Method not implemented.");
    }

}