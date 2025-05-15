import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";

import Swal from "sweetalert2";
import { Asignatura } from "../../modelos/asignatura.interface";
import { AsignaturaApiService } from "../../servicios/asignaturas_api.service";
import { ActualizarAsignaturaComponent } from "../actualizar-asignatura/actualizar-asignatura.component";
import { CrearAsignaturaComponent } from "../crear-asignatura/crear-asignatura.component";
import { UsuarioStorageService } from "src/app/servicios/auth/usuario-storage.service";
import { Usuario } from "src/app/servicios/auth/models/usuario.model";
import { RolesEnum } from "src/app/servicios/auth/enum/roles.enum";
@Component({
  selector: "app-visualizar-asignatura",
  templateUrl: "./visualizar-asignatura.component.html",
  styleUrls: ["./visualizar-asignatura.component.scss"],
})
export class VisualizarAsignaturaComponent implements OnInit, AfterViewInit {
  constructor(
    private readonly asignaturaService: AsignaturaApiService,
    private readonly usuarioService: UsuarioStorageService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
  ) {}

  asignaturaExistentes: Asignatura[] = [];
  filtro?: FormControl;
  archivoSeleccionado?: File;

  datosFilaAsignatura = new MatTableDataSource<Asignatura>([]);

  displayedColumns: string[] = ["codigo", "nombre", "creditos", "acciones"];
  @ViewChild("tablaSort") tablaSort = new MatSort();
  @ViewChild(MatPaginator) paginador?: MatPaginator;
  rutaActual = this.router.url;

  //Rol de usuarios
  usuario?: Usuario;

  // Filtrar entre todos los elementos de la tabla
  filtrarTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datosFilaAsignatura.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.cargarRegistros();
  }

  ngAfterViewInit(): void {
    this.datosFilaAsignatura.sort = this.tablaSort;
    this.datosFilaAsignatura.paginator = this.paginador!;
  }

  cargarRegistros() {
    Swal.showLoading();
    this.asignaturaService.obtenerAsignaturas().subscribe({
      next: (data) => {
        const asignaturas = data as Asignatura[];
        this.asignaturaExistentes = asignaturas;
      },
      error: () => {
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
      },
      complete: () => {
        this.datosFilaAsignatura.data = this.asignaturaExistentes;
        Swal.close();
      },
    });
  }

  eliminarAsignatura(asignatura: Asignatura) {
    Swal.fire({
      title: "Eliminar asignatura",
      text: `¿Está seguro de eliminar la asignatura ${asignatura.nombre}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.showLoading();
        //Eliminar asignatura por id
        this.asignaturaService
          .eliminarAsignaturaPorID(asignatura.id!)
          .subscribe({
            next: () => {
              Swal.fire(
                "Eliminado",
                `Se ha eliminado la asignatura ${asignatura.nombre}.`,
                "success",
              );
              //Quitar del arreglo
              const indice = this.datosFilaAsignatura.data.indexOf(
                this.datosFilaAsignatura.data.find(
                  (fila) => fila.id == asignatura.id,
                )!,
              );
              const asignaturas = this.datosFilaAsignatura.data;
              asignaturas.splice(indice, 1);
              this.datosFilaAsignatura.data = asignaturas;
            },
            //Error al eliminar
            error: () => {
              Swal.fire(
                "Error",
                `No se pudo eliminar la asignatura ${asignatura.nombre}`,
                "error",
              );
            },
          });
      }
    });
  }

  crearVariasAsignaturas() {
    Swal.showLoading();
    if (this.archivoSeleccionado) {
      this.asignaturaService
        .crearVariasAsignaturas(this.archivoSeleccionado)
        .subscribe({
          next: (result: any) => {
            const substring = String(result.mensaje);
            if (substring.substr(-2) == "s.") {
              Swal.fire(
                "Archivo cargado exitosamente",
                result.mensaje,
                "success",
              ).then((result) => {
                if (result.isDismissed || result.isConfirmed) {
                  //Actualizar
                  this.datosFilaAsignatura.data = [];
                  this.cargarRegistros();
                }
              });
            } else {
              const mensaje = `Se han creado ${result.asignaturasIngresadas.length} registros. Hay ${result.asignaturasNoIngresadas.length} repetidos.`;
              let numColumnas =
                result.asignaturasNoIngresadas.length > 8 ? 2 : 1;
              let anchoSwal =
                result.asignaturasNoIngresadas.length <= 4 ? "50vw" : "75vw";
              numColumnas =
                result.asignaturasNoIngresadas.length <= 4 ? 1 : numColumnas;
              const repetidos =
                `<div style="column-count: ${numColumnas};">` +
                "<p>" +
                result.asignaturasNoIngresadas
                  .map((r: Asignatura) => {
                    return r.nombre;
                  })
                  .join("</p><p>") +
                "</p>" +
                "</div>";
              Swal.fire({
                title: "Archivo cargado incompletamente",
                icon: "info",
                html: "<h2>" + mensaje + "</h2>" + repetidos,
                width: anchoSwal,
              }).then((result) => {
                if (result.isDismissed || result.isConfirmed) {
                  // Actualizar
                  this.datosFilaAsignatura.data = [];
                  this.cargarRegistros();
                }
              });
            }
          },
          error: (result: any) => {
            Swal.fire("Error", result.error.message, "error").then((result) => {
              if (result.isDismissed || result.isConfirmed) {
                this.archivoSeleccionado = undefined;
              }
            });
          },
          complete: () => {
            this.archivoSeleccionado = undefined;
          },
        });
    }
  }

  abrirCreacionAsignatura() {
    const dialogRef = this.dialog.open(CrearAsignaturaComponent, {
      width: "auto",
      height: "auto",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.cargarRegistros();
    });
  }

  abrirActualizacionAsignatura(asignatura: Asignatura) {
    const dialogRef = this.dialog.open(ActualizarAsignaturaComponent, {
      width: "auto",
      height: "auto",
      data: asignatura.id,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.cargarRegistros();
    });
  }

  seleccionarArchivo(event: any): void {
    this.archivoSeleccionado = event.target.files[0] ?? undefined;
    if (this.archivoSeleccionado) {
      const fileReader = new FileReader();
      fileReader.readAsText(this.archivoSeleccionado);
      fileReader.onload = (e) => {
        console.log("LECTURA", fileReader.result);
      };
      this.crearVariasAsignaturas();
    }
  }

  //Verificaciòn de rol
  esCoordinador() {
    return this.usuarioService.obtenerRoles().includes(RolesEnum.COORDINADOR);
  }

  esAsistenteAcademico() {
    return this.usuarioService
      .obtenerRoles()
      .includes(RolesEnum.ASISTENTE_ACADEMICO);
  }
}
