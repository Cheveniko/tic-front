import { Component, OnInit, ViewChild } from "@angular/core";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import { FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { Usuario } from "src/app/servicios/auth/models/usuario.model";
import { UsuarioStorageService } from "src/app/servicios/auth/usuario-storage.service";

import Swal from "sweetalert2";
import { Horario } from "../../modelos/horario.interface";
import { HorarioApiService } from "../../servicios/horarios_api.service";
import { RolesEnum } from "src/app/servicios/auth/enum/roles.enum";

@Component({
  selector: "app-visualizar-lista-horarios",
  templateUrl: "./visualizar-lista-horarios.component.html",
  styleUrls: ["./visualizar-lista-horarios.component.scss"],
})
export class VisualizarListaHorariosComponent implements OnInit {
  constructor(
    private readonly usuarioStorageService: UsuarioStorageService,
    private readonly horarioServicio: HorarioApiService,
    private readonly router: Router,
  ) {}

  filtro?: FormControl;
  usuario?: Usuario;
  horarios: Horario[] = [];

  datoFilaHorario = new MatTableDataSource<Horario>([]);

  displayedColumns: string[] = ["semestre", "descargar", "visualizar"];
  @ViewChild("tablaSort") tablaSort = new MatSort();
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  rutaActual = this.router.url;

  // Filtrar entre todos los elementos de la tabla
  filtrarTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datoFilaHorario.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.cargarUsuario();
    this.cargarRegistros();
  }

  ngAfterViewInit(): void {
    this.datoFilaHorario.sort = this.tablaSort;
    this.datoFilaHorario.paginator = this.paginator!;
  }

  cargarUsuario() {
    this.usuario = this.usuarioStorageService.obtenerUsuario();
  }

  cargarRegistros() {
    Swal.showLoading();
    this.horarioServicio.obtenerHorarios().subscribe({
      next: (data: any) => {
        this.horarios = data;
        const groupedBySemester = data.reduce((acc: any, current: any) => {
          if (!acc[current.semestre]) {
            acc[current.semestre] = current;
          }
          return acc;
        }, {});
        this.datoFilaHorario.data = Object.values(groupedBySemester);
      },
      complete: () => Swal.close(),
    });
  }

  //Verificaciòn de rol
  esCoordinador() {
    return this.usuarioStorageService
      .obtenerRoles()
      .includes(RolesEnum.COORDINADOR);
  }

  esAsistenteAcademico() {
    return this.usuarioStorageService
      .obtenerRoles()
      .includes(RolesEnum.ASISTENTE_ACADEMICO);
  }

  exportarExcelPorSemestre(semestre: string): void {
    const horas = [
      "07:00",
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
    ];

    const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

    // Initialize the sheet data with header
    const sheetData = [
      ["Hora", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    ];

    // Initialize all hour rows with empty cells
    horas.forEach((hora) => sheetData.push([hora, "", "", "", "", ""]));

    // Filter horarios for the specific semester
    const horariosSemestre = this.horarios.filter(
      (h) => h.semestre === semestre,
    );

    // Fill the matrix with subjects
    horariosSemestre.forEach((horario) => {
      const diaIndex = diasSemana.indexOf(horario.dia);

      if (diaIndex !== -1) {
        const horaInicio = parseInt(horario.hora_inicio.split(":")[0], 10);
        const horaFin = parseInt(horario.hora_fin.split(":")[0], 10);

        // Fill all hours from start to end
        for (let horaActual = horaInicio; horaActual < horaFin; horaActual++) {
          const horaString = `${horaActual.toString().padStart(2, "0")}:00`;
          const horaIndex = horas.indexOf(horaString);

          if (horaIndex !== -1) {
            // +1 because first row is header, +1 because diaIndex starts at 0 but we want column 1+
            const cellContent = `${horario.materia} - ${horario.profesor || ""} - ${horario.aula || ""} - ${horario.grupo || ""}`;
            sheetData[horaIndex + 1][diaIndex + 1] = cellContent;
          }
        }
      }
    });

    // Create and export the Excel file
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, `Horarios-${semestre}`);
    XLSX.writeFile(workbook, `Reporte-horarios-${semestre}.xlsx`);
  }

  exportarPDFPorSemestre(semestre: string): void {
    const doc = new jsPDF("l", "mm", "a4"); // Landscape orientation

    // Configuración de la página
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const usableWidth = pageWidth - margin * 2;
    const usableHeight = pageHeight - 40; // Espacio para título y pie de página

    // Configuración de la tabla
    const horas = [
      "07:00",
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
    ];

    const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

    // Dimensiones de la tabla
    const headerHeight = 12;
    const rowHeight = 40; // Aumentado para acomodar más texto
    const hourColumnWidth = 25;
    const dayColumnWidth = (usableWidth - hourColumnWidth) / diasSemana.length;

    // Filtrar horarios para el semestre específico
    const horariosSemestre = this.horarios.filter(
      (h) => h.semestre === semestre,
    );

    // Crear matriz de horarios
    const horarioMatrix: string[][] = [];
    horas.forEach(() => {
      horarioMatrix.push(["", "", "", "", ""]);
    });

    // Llenar la matriz
    horariosSemestre.forEach((horario) => {
      const diaIndex = diasSemana.indexOf(horario.dia);

      if (diaIndex !== -1) {
        const horaInicio = parseInt(horario.hora_inicio.split(":")[0], 10);
        const horaFin = parseInt(horario.hora_fin.split(":")[0], 10);

        for (let horaActual = horaInicio; horaActual < horaFin; horaActual++) {
          const horaString = `${horaActual.toString().padStart(2, "0")}:00`;
          const horaIndex = horas.indexOf(horaString);

          if (horaIndex !== -1) {
            const cellContent = `${horario.materia}|${horario.profesor || ""}|${horario.aula || ""}|${horario.grupo || ""}`;
            horarioMatrix[horaIndex][diaIndex] = cellContent;
          }
        }
      }
    });

    // Función para dibujar encabezados
    const drawHeader = (startY: number) => {
      // Título
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(`Horario - Semestre: ${semestre}`, pageWidth / 2, 20, {
        align: "center",
      });

      // Encabezados de la tabla
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");

      // Encabezado "Hora"
      doc.rect(margin, startY, hourColumnWidth, headerHeight);
      doc.text("Hora", margin + hourColumnWidth / 2, startY + 8, {
        align: "center",
      });

      // Encabezados de los días
      diasSemana.forEach((dia, index) => {
        const x = margin + hourColumnWidth + index * dayColumnWidth;
        doc.rect(x, startY, dayColumnWidth, headerHeight);
        doc.text(dia, x + dayColumnWidth / 2, startY + 8, { align: "center" });
      });
    };

    // Función para dividir texto en líneas que quepan en la celda
    const splitTextToLines = (text: string, maxWidth: number): string[] => {
      const words = text.split(" ");
      const lines: string[] = [];
      let currentLine = "";

      words.forEach((word) => {
        const testLine = currentLine + (currentLine ? " " : "") + word;
        const textWidth = doc.getTextWidth(testLine);

        if (textWidth > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });

      if (currentLine) {
        lines.push(currentLine);
      }

      return lines;
    };

    // Función para dibujar una fila
    const drawRow = (hora: string, horaIndex: number, y: number) => {
      // Columna de hora
      doc.rect(margin, y, hourColumnWidth, rowHeight);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(hora, margin + hourColumnWidth / 2, y + 12, { align: "center" });

      // Columnas de días
      diasSemana.forEach((dia, diaIndex) => {
        const x = margin + hourColumnWidth + diaIndex * dayColumnWidth;
        doc.rect(x, y, dayColumnWidth, rowHeight);

        // Contenido de la celda
        const cellContent = horarioMatrix[horaIndex][diaIndex];
        if (cellContent) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);

          const parts = cellContent
            .split("|")
            .filter((part) => part.trim() !== "");
          let currentY = y + 6;
          const lineHeight = 4;
          const maxWidth = dayColumnWidth - 4;

          parts.forEach((part, partIndex) => {
            const lines = splitTextToLines(part, maxWidth);

            lines.forEach((line) => {
              if (currentY < y + rowHeight - 3) {
                // Aplicar formato especial para materia (primera parte)
                if (partIndex === 0) {
                  doc.setFont("helvetica", "bold");
                } else {
                  doc.setFont("helvetica", "normal");
                }

                doc.text(line, x + 2, currentY, { align: "left" });
                currentY += lineHeight;
              }
            });
          });
        }
      });
    };

    // Función para agregar pie de página
    const drawFooter = () => {
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      const fechaActual = new Date().toLocaleDateString("es-ES");
      doc.text(`Generado el: ${fechaActual}`, margin, pageHeight - 10);
      doc.text(
        `Página ${doc.getNumberOfPages()}`,
        pageWidth - margin - 20,
        pageHeight - 10,
      );
    };

    // Dibujar el contenido
    let currentY = 35;
    let currentPageStartY = currentY;

    // Dibujar encabezados en la primera página
    drawHeader(currentPageStartY);
    currentY = currentPageStartY + headerHeight;

    horas.forEach((hora, horaIndex) => {
      // Verificar si necesitamos una nueva página
      if (currentY + rowHeight > pageHeight - 30) {
        // Agregar pie de página a la página actual
        drawFooter();

        // Crear nueva página
        doc.addPage();
        currentY = 35;
        currentPageStartY = currentY;

        // Dibujar encabezados en la nueva página
        drawHeader(currentPageStartY);
        currentY = currentPageStartY + headerHeight;
      }

      // Dibujar la fila
      drawRow(hora, horaIndex, currentY);
      currentY += rowHeight;
    });

    // Agregar pie de página a la última página
    drawFooter();

    // Descargar el PDF
    doc.save(`Horario-${semestre}.pdf`);
  }
}
