import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";

import Swal from "sweetalert2";
import { Carrera } from "../../modelos/carrera.interface";
import { CarreraApiService } from "../../servicios/carreras_api.service";
import { ActualizarCarreraComponent } from "../actualizar-carrera/actualizar-carrera.component";
import { CrearCarreraComponent } from "../crear-carrera/crear-carrera.component";
import { Usuario } from "src/app/servicios/auth/models/usuario.model";
import { UsuarioStorageService } from "src/app/servicios/auth/usuario-storage.service";
import { RolesEnum } from "src/app/servicios/auth/enum/roles.enum";

@Component({
  selector: "app-visualizar-carrera",
  templateUrl: "./visualizar-carrera.component.html",
  styleUrls: ["./visualizar-carrera.component.scss"],
})
export class VisualizarCarreraComponent implements OnInit, AfterViewInit {
  constructor(
    private readonly carreraService: CarreraApiService,
    private readonly usuarioService: UsuarioStorageService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
  ) {}

  carreraExistentes: Carrera[] = [];
  filtro?: FormControl;

  datosFilaCarrera = new MatTableDataSource<Carrera>([]);

  displayedColumns: string[] = [
    "codigo",
    "nombre",
    "duracion",
    "modalidad",
    "acciones",
  ];
  @ViewChild("tablaSort") tablaSort = new MatSort();
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  rutaActual = this.router.url;

  //Rol de usuarios
  usuario?: Usuario;

  //Filtrar entre todos los elementos de la tabla
  filtrarTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datosFilaCarrera.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.cargarRegistros();
  }

  ngAfterViewInit(): void {
    this.datosFilaCarrera.sort = this.tablaSort;
    this.datosFilaCarrera.paginator = this.paginator!;
  }

  cargarRegistros() {
    Swal.showLoading();
    this.carreraService.obtenerCarreras().subscribe({
      next: (data) => {
        const carreras = data as Carrera[];
        this.carreraExistentes = carreras;
      },
      error: (Err) => {
        console.log("error: ", Err);
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
        this.datosFilaCarrera.data = this.carreraExistentes;
        Swal.close();
      },
    });
  }

  eliminarCarrera(carrera: Carrera) {
    Swal.fire({
      title: "Eliminar carrera",
      text: `¿Está seguro de eliminar la carrera ${carrera.nombre}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.showLoading();
        // Eliminar carrera por id
        this.carreraService.eliminarCarreraPorID(carrera.id!).subscribe({
          next: () => {
            Swal.fire(
              "Eliminado",
              `Se ha eliminado la carrera ${carrera.nombre}.`,
              "success",
            );
            // Quitar del arreglo
            const indice = this.datosFilaCarrera.data.indexOf(
              this.datosFilaCarrera.data.find((fila) => fila.id == carrera.id)!,
            );
            const carreras = this.datosFilaCarrera.data;
            carreras.splice(indice, 1);
            this.datosFilaCarrera.data = carreras;
          },
          // Error al eliminar
          error: () => {
            Swal.fire(
              "Error",
              `No se pudo eliminar la carrera ${carrera.nombre}`,
              "error",
            );
          },
        });
      }
    });
  }

  abrirCreacionCarrera() {
    const dialogRef = this.dialog.open(CrearCarreraComponent, {
      width: "auto",
      height: "auto",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.cargarRegistros();
    });
  }

  abrirActualizacionCarrera(carrera: Carrera) {
    const dialogRef = this.dialog.open(ActualizarCarreraComponent, {
      width: "auto",
      height: "auto",
      data: carrera.id,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.cargarRegistros();
    });
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

  descargarReporte(formato: string) {
    this.carreraService.obtenerCarreras().subscribe({
      next: (data) => {
        const carreras = data as Carrera[];
        if (formato === "xlsx") {
          const worksheet = XLSX.utils.json_to_sheet(carreras);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Carreras");
          XLSX.writeFile(workbook, "ReporteCarreras.xlsx");
        } else if (formato === "pdf") {
          const doc = new jsPDF();
          const pageHeight = doc.internal.pageSize.height;
          const marginTop = 20;
          const lineHeight = 10;

          doc.setFontSize(16);
          doc.setTextColor(40, 40, 40);
          doc.setFont("helvetica", "bold");
          doc.text("Reporte de Carreras", 10, marginTop);

          doc.setFontSize(12);
          doc.setFont("helvetica", "normal");

          let yPosition = marginTop + lineHeight;

          carreras.forEach((carrera, index) => {
            if (yPosition + lineHeight > pageHeight - marginTop) {
              doc.addPage();
              yPosition = marginTop;
            }
            doc.text(
              `${index + 1}. ${carrera.nombre} - ${carrera.codigo} - ${carrera.modalidad} - ${carrera.duracion} semestres`,
              10,
              yPosition,
            );
            yPosition += lineHeight;
          });
          doc.save("ReporteCarreras.pdf");
        }
      },
      error: () => {
        Swal.fire("Error", "No se pudieron exportar los datos.", "error");
      },
    });
  }
}
