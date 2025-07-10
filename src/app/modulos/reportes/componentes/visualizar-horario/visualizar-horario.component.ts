import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Docente } from "src/app/modulos/docentes/modelos/docente.interface";
import { DocenteApiService } from "src/app/modulos/docentes/servicios/docentes_api.service";
import { Grupo } from "src/app/modulos/grupos/modelos/grupo.interface";
import { GrupoApiService } from "src/app/modulos/grupos/servicios/grupo_api.service";
import JornadaLaboral from "src/app/modulos/parametros-inciales/models/jornada-laboral.interface";
import { SemestreService } from "src/app/modulos/parametros-inciales/services/semestre-api.service";
import Swal from "sweetalert2";
import { HorarioEstupido } from "../../modelos/horario.interface";
import { HorarioGrupo } from "../../modelos/horarioGrupo.interface";
import { HorarioDocente } from "../../modelos/horarioDocente.interface";
import { HorarioApiService } from "../../servicios/horarios_api.service";

interface Hora {
  hora: number;
  rangoHoras: string;
  horarioFilaDocente: HorarioDocente[];
  horarioFilaGrupo: HorarioGrupo[];
}

@Component({
  selector: "app-visualizar-horario",
  templateUrl: "./visualizar-horario.component.html",
  styleUrls: ["./visualizar-horario.component.scss"],
})
export class VisualizarHorarioComponent implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly ruta: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly horarioService: HorarioApiService,
    private readonly docenteService: DocenteApiService,
    private readonly semestresService: SemestreService,
    private readonly grupoService: GrupoApiService,
  ) {}

  columnasTabla: string[] = ["HORA"];
  datoFilasTabla = new MatTableDataSource<Hora>([]);
  jornadasLaborales?: JornadaLaboral[];

  horarioJSON?: HorarioEstupido;
  arregloDocentes?: Docente[];
  arregloGrupos?: Grupo[];

  params$?: Subscription;
  filtroDocenteSuscripcion$?: Subscription;
  filtroGrupoSuscripcion$?: Subscription;
  filtroSeleccionado?: string;

  cargando: boolean = false;

  formGroup?: FormGroup;
  idHorario?: string;

  ngOnInit(): void {
    Swal.showLoading();
    this.cargarDatosSelect();
    this.cargarMatrizHorario();
    this.formularioControl();
  }

  cargarMatrizHorario() {
    this.semestresService
      .obtenerSemestreConPlanificacionEnProgreso()
      .subscribe({
        next: (semestre) => {
          // Se obtienen las jornadas laborales
          this.jornadasLaborales = semestre.jornadas;

          // Ordenar datos en la semana
          const dias = [
            "LUNES",
            "MARTES",
            "MIÉRCOLES",
            "JUEVES",
            "VIERNES",
            "SÁBADO",
            "DOMINGO",
          ];
          dias.forEach((dia) => {
            this.jornadasLaborales!.forEach((jornada) => {
              if (jornada.dia.toUpperCase() == dia) {
                this.columnasTabla.push(jornada.dia);
              }
            });
          });
          // Crear filas en la tabla
          this.crearFilasTabla();
        },
        error: () => {
          this.mostrarMensajeError();
        },
      });
  }

  cargarDatosSelect() {
    this.params$ = this.ruta.params.subscribe({
      next: (params) => {
        this.idHorario = String(params["id"]);
        this.obtenerDocentes();
        this.obtenerGrupos();
      },
      error: (res) => {
        this.redireccionarTrasError(res);
      },
    });
  }

  crearFilasTabla() {
    // Identificar horas mínima y máxima
    let horaMinima = 24;
    let horaMaxima = 0;
    for (let jornada of this.jornadasLaborales!) {
      const horaInicio = Number(jornada.horaInicio.split(":")[0]);
      const horaFin = Number(jornada.horaFin.split(":")[0]);
      horaMinima = horaInicio < horaMinima ? horaInicio : horaMinima;
      horaMaxima = horaFin > horaMaxima ? horaFin : horaMaxima;
    }

    const rangoHoras = horaMaxima - horaMinima;

    for (let indice = 0; indice < rangoHoras; indice++) {
      const hora = horaMinima + indice;
      const horaSemana = {
        hora: hora,
        rangoHoras: `${hora}:00 - ${hora + 1}:00`,
        horarioFilaDocente: [],
        horarioFilaGrupo: [],
      };
      this.datoFilasTabla.data.push(horaSemana);
    }

    Swal.close();
    this.cargando = true;
  }

  formularioControl() {
    this.formGroup = this.formBuilder.group({
      filtroDocente: new FormControl({ value: "", disabled: false }),
      filtroGrupo: new FormControl({ value: "", disabled: false }),
    });

    this.filtroDocenteSuscripcion$ = this.formGroup
      .get("filtroDocente")!
      .valueChanges.subscribe({
        next: (nombreDocente) => {
          if (this.formGroup!.get("filtroDocente")!.value != "") {
            this.datoFilasTabla.data.forEach((fila) => {
              fila.horarioFilaGrupo = [];
              fila.horarioFilaDocente = [];
            });

            Swal.showLoading();

            this.horarioService
              .obtenerHorarioDocente(nombreDocente, this.idHorario!)
              .subscribe({
                next: (arregloDocentes) => {
                  for (let i = 0; i < this.datoFilasTabla.data.length; i++) {
                    const filtroDeHorario = arregloDocentes.filter(
                      (horario) => {
                        return (
                          Number(horario.horario.split(":")[0]) ==
                          this.datoFilasTabla.data[i].hora
                        );
                      },
                    );
                    filtroDeHorario.forEach((h) => {
                      this.datoFilasTabla.data[i].horarioFilaDocente?.push(h);
                    });
                  }
                },
                error: (error) => {
                  Swal.fire("Error", `${error.message}`, "error");
                },
                complete: () => {
                  Swal.close();
                },
              });
            this.formGroup?.get("filtroGrupo")!.setValue("");
          }
        },
      });

    this.filtroGrupoSuscripcion$ = this.formGroup
      .get("filtroGrupo")!
      .valueChanges.subscribe({
        next: (nombreGrupo) => {
          if (this.formGroup!.get("filtroGrupo")!.value != "") {
            this.datoFilasTabla.data.forEach((fila) => {
              fila.horarioFilaGrupo = [];
              fila.horarioFilaDocente = [];
            });

            Swal.showLoading();

            this.horarioService
              .obtenerHorarioGrupo(nombreGrupo, this.idHorario!)
              .subscribe({
                next: (arregloGrupos) => {
                  for (let i = 0; i < this.datoFilasTabla.data.length; i++) {
                    const filtroDeHorario = arregloGrupos.filter((horario) => {
                      return (
                        Number(horario.horario.split(":")[0]) ==
                        this.datoFilasTabla.data[i].hora
                      );
                    });
                    filtroDeHorario.forEach((h) => {
                      this.datoFilasTabla.data[i].horarioFilaGrupo?.push(h);
                    });
                  }
                },
                error: (error) => {
                  Swal.fire("Error", `${error.message}`, "error");
                },
                complete: () => {
                  Swal.close();
                },
              });

            this.formGroup?.get("filtroDocente")!.setValue("");
          }
        },
      });
  }

  obtenerHorarioPorDiaDocente(arregloHorario: HorarioDocente[], dia: string) {
    if (arregloHorario) {
      return arregloHorario.find((horario) => {
        return horario.dia == dia;
      });
    }
    return undefined;
  }

  obtenerHorarioPorDiaGrupo(arregloHorario: HorarioGrupo[], dia: string) {
    if (arregloHorario) {
      return arregloHorario.find((horario) => {
        return horario.dia == dia;
      });
    }
    return undefined;
  }

  obtenerDocentes() {
    this.docenteService.visualizarDocentes().subscribe({
      next: (result) => {
        this.arregloDocentes = result as Docente[];
      },
      error: (error) => {
        Swal.fire(
          "Error",
          "No se pudo obtener los datos de los docentes.",
          "error",
        );
      },
    });
  }

  obtenerGrupos() {
    this.grupoService.obtenerGrupos().subscribe({
      next: (result) => {
        this.arregloGrupos = result as Grupo[];
      },
      error: (error) => {
        Swal.fire(
          "Error",
          "No se pudo obtener los datos de los grupos.",
          "error",
        );
      },
    });
  }

  redireccionarTrasError(res: any) {
    Swal.fire("Error", res.error.message, "error").then((result) => {
      if (result.isConfirmed || result.isDismissed) {
        this.router.navigate(["/spa", "horarios"]);
      }
    });
  }

  mostrarMensajeError() {
    Swal.fire({
      title: "Error",
      text: "No se pudieron obtener los registros.",
      showCancelButton: true,
      confirmButtonText: "Reiniciar página",
      cancelButtonText: "Cerrar",
      icon: "error",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.params$) {
      this.params$.unsubscribe();
    }
    if (this.filtroGrupoSuscripcion$) {
      this.filtroGrupoSuscripcion$.unsubscribe();
    }
    if (this.filtroDocenteSuscripcion$) {
      this.filtroDocenteSuscripcion$.unsubscribe();
    }
  }

  actionExample() {
    console.log("actionExample");
  }
}
