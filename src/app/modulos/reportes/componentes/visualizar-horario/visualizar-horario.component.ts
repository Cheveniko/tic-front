import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Horario } from "../../modelos/horario.interface";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import { HorarioApiService } from "../../servicios/horarios_api.service";
import { Router } from "@angular/router";
import { FormControl } from "@angular/forms";
import { Location } from "@angular/common";

export interface FilaHorario {
  hora: string;
  lunes: Horario | null;
  martes: Horario | null;
  miercoles: Horario | null;
  jueves: Horario | null;
  viernes: Horario | null;
  sabado: Horario | null;
}

@Component({
  selector: "app-visualizar-horario",
  templateUrl: "./visualizar-horario.component.html",
  styleUrls: ["./visualizar-horario.component.scss"],
})
export class VisualizarHorarioComponent implements OnInit {
  constructor(
    private horarioService: HorarioApiService,
    private readonly router: Router,
    private location: Location,
  ) {}

  horarios: Horario[] = []; // Tu array de datos
  horariosFiltrados: Horario[] = []; // Array filtrado
  datoFilasTabla = new MatTableDataSource<FilaHorario>([]);

  displayedColumns: string[] = [
    "hora",
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
  ];

  horas: string[] = [
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
    "20:00",
  ];

  diasSemana: string[] = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  currentRoute: string = "";

  // Controles de filtros
  filtroProfesor = new FormControl("");
  filtroAula = new FormControl("");
  filtroGrupo = new FormControl("");
  filtroMateria = new FormControl("");

  // Listas para los dropdowns
  profesores: string[] = [];
  aulas: string[] = [];
  grupos: string[] = [];
  materias: string[] = [];

  // Estado de los filtros
  mostrarFiltros = false;

  ngOnInit(): void {
    this.currentRoute = this.router.url.split("/").pop() || "";
    this.cargarHorarios();
    this.configurarFiltros();
  }

  cargarHorarios(): void {
    this.horarioService.obtenerHorarioSemestre(this.currentRoute).subscribe({
      next: (horario) => {
        this.horarios = horario;
        this.horariosFiltrados = [...horario]; // Inicializar filtrados
        this.extraerOpcionesFiltros();
        this.procesarHorarios();
      },
      error: (error) => {
        console.error("Error al cargar horarios:", error);
        this.horarios = [];
        this.horariosFiltrados = [];
        this.procesarHorarios();
      },
    });
  }

  configurarFiltros(): void {
    // Suscribirse a cambios en los filtros
    this.filtroProfesor.valueChanges.subscribe(() => this.aplicarFiltros());
    this.filtroAula.valueChanges.subscribe(() => this.aplicarFiltros());
    this.filtroGrupo.valueChanges.subscribe(() => this.aplicarFiltros());
    this.filtroMateria.valueChanges.subscribe(() => this.aplicarFiltros());
  }

  extraerOpcionesFiltros(): void {
    // Extraer valores únicos para los dropdowns
    this.profesores = [
      ...new Set(this.horarios.map((h) => h.profesor).filter((p) => p)),
    ].sort();
    this.aulas = [
      ...new Set(this.horarios.map((h) => h.aula).filter((a) => a)),
    ].sort();
    this.grupos = [
      ...new Set(this.horarios.map((h) => h.grupo).filter((g) => g)),
    ].sort();
    this.materias = [
      ...new Set(this.horarios.map((h) => h.materia).filter((m) => m)),
    ].sort();
  }

  aplicarFiltros(): void {
    this.horariosFiltrados = this.horarios.filter((horario) => {
      const coincideProfesor =
        !this.filtroProfesor.value ||
        horario.profesor
          ?.toLowerCase()
          .includes(this.filtroProfesor.value.toLowerCase());

      const coincideAula =
        !this.filtroAula.value ||
        horario.aula
          ?.toLowerCase()
          .includes(this.filtroAula.value.toLowerCase());

      const coincideGrupo =
        !this.filtroGrupo.value ||
        horario.grupo
          ?.toLowerCase()
          .includes(this.filtroGrupo.value.toLowerCase());

      const coincideMateria =
        !this.filtroMateria.value ||
        horario.materia
          ?.toLowerCase()
          .includes(this.filtroMateria.value.toLowerCase());

      return (
        coincideProfesor && coincideAula && coincideGrupo && coincideMateria
      );
    });

    this.procesarHorarios();
  }

  limpiarFiltros(): void {
    this.filtroProfesor.setValue("");
    this.filtroAula.setValue("");
    this.filtroGrupo.setValue("");
    this.filtroMateria.setValue("");
  }

  toggleFiltros(): void {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  procesarHorarios(): void {
    const filasHorario: FilaHorario[] = [];

    this.horas.forEach((hora) => {
      const fila: FilaHorario = {
        hora: hora,
        lunes: null,
        martes: null,
        miercoles: null,
        jueves: null,
        viernes: null,
        sabado: null,
      };

      // Usar horarios filtrados en lugar de todos los horarios
      this.horariosFiltrados.forEach((horario) => {
        const horaInicio = parseInt(horario.hora_inicio.split(":")[0], 10);
        const horaFin = parseInt(horario.hora_fin.split(":")[0], 10);
        const horaActual = parseInt(hora.split(":")[0], 10);

        if (horaActual >= horaInicio && horaActual < horaFin) {
          const dia = horario.dia.toLowerCase();

          switch (dia) {
            case "lunes":
              fila.lunes = horario;
              break;
            case "martes":
              fila.martes = horario;
              break;
            case "miércoles":
              fila.miercoles = horario;
              break;
            case "jueves":
              fila.jueves = horario;
              break;
            case "viernes":
              fila.viernes = horario;
              break;
            case "sabado":
              fila.sabado = horario;
              break;
          }
        }
      });

      filasHorario.push(fila);
    });

    this.datoFilasTabla.data = filasHorario;
  }

  // Método para obtener el texto de una celda
  obtenerTextoHorario(horario: Horario | null): string {
    if (!horario) return "";

    return `${horario.materia}\n${horario.profesor}\n${horario.aula}\n${horario.grupo}`;
  }

  // Método para verificar si una celda debe mostrar contenido
  // (para evitar duplicados en horarios de múltiples horas)
  deberMostrarContenido(horario: Horario | null, horaActual: string): boolean {
    if (!horario) return false;

    const horaInicio = horario.hora_inicio.substring(0, 5); // "07:00"
    return horaInicio === horaActual;
  }

  // Método para calcular el rowspan de una celda
  calcularRowspan(horario: Horario | null): number {
    if (!horario) return 1;

    const horaInicio = parseInt(horario.hora_inicio.split(":")[0], 10);
    const horaFin = parseInt(horario.hora_fin.split(":")[0], 10);
    return horaFin - horaInicio;
  }

  regresarPantallaAnterior(): void {
    this.location.back();
  }

  descargarExcel(): void {
    const sheetData = [
      ["Hora", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    ];

    // Crear matriz de horarios usando los datos filtrados
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
      "20:00",
    ];

    const diasSemana = [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];

    // Inicializar todas las filas de horas con celdas vacías
    horas.forEach((hora) => {
      sheetData.push([hora, "", "", "", "", "", ""]);
    });

    // Llenar la matriz con los horarios filtrados
    this.horariosFiltrados.forEach((horario) => {
      const diaIndex = diasSemana.indexOf(horario.dia);

      if (diaIndex !== -1) {
        const horaInicio = parseInt(horario.hora_inicio.split(":")[0], 10);
        const horaFin = parseInt(horario.hora_fin.split(":")[0], 10);

        // Llenar todas las horas desde inicio hasta fin
        for (let horaActual = horaInicio; horaActual < horaFin; horaActual++) {
          const horaString = `${horaActual.toString().padStart(2, "0")}:00`;
          const horaIndex = horas.indexOf(horaString);

          if (horaIndex !== -1) {
            const cellContent = `${horario.materia} ${horario.profesor || ""} ${horario.aula || ""} ${horario.grupo || ""}`;
            sheetData[horaIndex + 1][diaIndex + 1] = cellContent;
          }
        }
      }
    });

    // Crear el archivo Excel
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    // Configurar anchos de columnas
    const colWidths = [
      { wch: 10 }, // Hora
      { wch: 25 }, // Lunes
      { wch: 25 }, // Martes
      { wch: 25 }, // Miércoles
      { wch: 25 }, // Jueves
      { wch: 25 }, // Viernes
      { wch: 25 }, // Sábado
    ];
    worksheet["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, "Horario");

    // Generar nombre del archivo con filtros aplicados
    const fechaActual = new Date().toISOString().split("T")[0];
    const nombreArchivo = `Horario-Filtrado-${fechaActual}.xlsx`;

    XLSX.writeFile(workbook, nombreArchivo);
  }

  descargarPDF(): void {
    const doc = new jsPDF("l", "mm", "a4");

    // Configuración de la página
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const usableWidth = pageWidth - margin * 2;

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
      "20:00",
    ];

    const diasSemana = [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];

    // Dimensiones de la tabla
    const headerHeight = 12;
    const rowHeight = 40;
    const hourColumnWidth = 25;
    const dayColumnWidth = (usableWidth - hourColumnWidth) / diasSemana.length;

    // Crear matriz de horarios usando datos filtrados
    const horarioMatrix: string[][] = [];
    horas.forEach(() => {
      horarioMatrix.push(["", "", "", "", "", ""]);
    });

    // Llenar la matriz con horarios filtrados
    this.horariosFiltrados.forEach((horario) => {
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
      const fechaActual = new Date().toLocaleDateString("es-ES");
      const filtrosTexto = this.obtenerTextoFiltros();

      // Título
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Horario Filtrado", pageWidth / 2, 20, { align: "center" });

      // Información de filtros
      if (filtrosTexto) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Filtros aplicados: ${filtrosTexto}`, pageWidth / 2, 30, {
          align: "center",
        });
      }

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

    // Función para dividir texto en líneas
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
      doc.text(
        `Mostrando ${this.horariosFiltrados.length} de ${this.horarios.length} horarios`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" },
      );
    };

    // Dibujar el contenido
    let currentY = 40;
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
        currentY = 40;
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

    // Generar nombre del archivo
    const fechaActual = new Date().toISOString().split("T")[0];
    const nombreArchivo = `Horario-Filtrado-${fechaActual}.pdf`;

    doc.save(nombreArchivo);
  }

  private obtenerTextoFiltros(): string {
    const filtrosAplicados: string[] = [];

    if (this.filtroProfesor.value) {
      filtrosAplicados.push(`Profesor: ${this.filtroProfesor.value}`);
    }
    if (this.filtroAula.value) {
      filtrosAplicados.push(`Aula: ${this.filtroAula.value}`);
    }
    if (this.filtroGrupo.value) {
      filtrosAplicados.push(`Grupo: ${this.filtroGrupo.value}`);
    }
    if (this.filtroMateria.value) {
      filtrosAplicados.push(`Materia: ${this.filtroMateria.value}`);
    }

    return filtrosAplicados.join(", ");
  }
}
