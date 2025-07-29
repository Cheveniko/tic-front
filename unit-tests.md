Unit tests realizados para el módulo de reportes globales

```typescript
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { of, throwError } from "rxjs";
import { VisualizarHorarioComponent } from "./visualizar-horario.component";
import { Horario } from "../../modelos/horario.interface";
import { HorarioApiService } from "../../servicios/horarios_api.service";

describe("VisualizarHorarioComponent", () => {
  let component: VisualizarHorarioComponent;
  let fixture: ComponentFixture<VisualizarHorarioComponent>;
  let mockHorarioService: jasmine.SpyObj<HorarioApiService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockLocation: jasmine.SpyObj<Location>;

  const mockHorarios: Horario[] = [
    {
      id: "1",
      profesor: "CALLE JIMÉNEZ TANIA ELIZABETH",
      aula: "AULA 101",
      grupo: "GR2CC",
      materia: "APLICACIONES WEB",
      dia: "Lunes",
      hora_inicio: "07:00:00",
      hora_fin: "09:00:00",
      semestre: "2025-A",
    },
    {
      id: "2",
      profesor: "BENALCÁZAR PALACIOS MARCO ENRIQUE",
      aula: "LABORATORIO 202",
      grupo: "GR2SW",
      materia: "INTELIGENCIA ARTIFICIAL",
      dia: "Martes",
      hora_inicio: "14:00:00",
      hora_fin: "16:00:00",
      semestre: "2025-A",
    },
    {
      id: "3",
      profesor: "ANDRADE PAREDES ROBERTO OMAR",
      aula: "AULA 102",
      grupo: "GR1SW",
      materia: "BASES DE DATOS",
      dia: "Miércoles",
      hora_inicio: "11:00:00",
      hora_fin: "13:00:00",
      semestre: "2025-A",
    },
  ];

  beforeEach(async () => {
    const horarioServiceSpy = jasmine.createSpyObj("HorarioApiService", ["obtenerHorarioSemestre"]);
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
    const locationSpy = jasmine.createSpyObj("Location", ["back"]);

    await TestBed.configureTestingModule({
      declarations: [VisualizarHorarioComponent],
      imports: [ReactiveFormsModule, MatTableModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatMenuModule, BrowserAnimationsModule],
      providers: [
        { provide: HorarioApiService, useValue: horarioServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VisualizarHorarioComponent);
    component = fixture.componentInstance;
    mockHorarioService = TestBed.inject(HorarioApiService) as jasmine.SpyObj<HorarioApiService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockLocation = TestBed.inject(Location) as jasmine.SpyObj<Location>;

    // Mock de currentRoute
    component.currentRoute = "2025-A";
  });

  describe("Inicialización del componente", () => {
    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should initialize with default values", () => {
      expect(component.horarios).toEqual([]);
      expect(component.horariosFiltrados).toEqual([]);
      expect(component.mostrarFiltros).toBeFalse();
      expect(component.filtroProfesor.value).toBe("");
      expect(component.filtroAula.value).toBe("");
      expect(component.filtroGrupo.value).toBe("");
      expect(component.filtroMateria.value).toBe("");
    });

    it("should have correct hours and days arrays", () => {
      expect(component.horas.length).toBe(14);
      expect(component.horas[0]).toBe("07:00");
      expect(component.horas[component.horas.length - 1]).toBe("20:00");

      expect(component.diasSemana.length).toBe(6);
      expect(component.diasSemana).toEqual(["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]);
    });
  });

  describe("Carga de datos", () => {
    it("should load horarios successfully", () => {
      mockHorarioService.obtenerHorarioSemestre.and.returnValue(of(mockHorarios));
      spyOn(component, "procesarHorarios");
      spyOn(component, "extraerOpcionesFiltros");

      component.cargarHorarios();

      expect(mockHorarioService.obtenerHorarioSemestre).toHaveBeenCalledWith("2025-A");
      expect(component.horarios).toEqual(mockHorarios);
      expect(component.horariosFiltrados).toEqual(mockHorarios);
      expect(component.extraerOpcionesFiltros).toHaveBeenCalled();
      expect(component.procesarHorarios).toHaveBeenCalled();
    });

    it("should handle error when loading horarios", () => {
      mockHorarioService.obtenerHorarioSemestre.and.returnValue(throwError("Error loading data"));
      spyOn(console, "error");
      spyOn(component, "procesarHorarios");

      component.cargarHorarios();

      expect(component.horarios).toEqual([]);
      expect(component.horariosFiltrados).toEqual([]);
      expect(console.error).toHaveBeenCalledWith("Error al cargar horarios:", "Error loading data");
      expect(component.procesarHorarios).toHaveBeenCalled();
    });

    it("should extract filter options correctly", () => {
      component.horarios = mockHorarios;

      component.extraerOpcionesFiltros();

      expect(component.profesores.length).toBe(3);
      expect(component.profesores).toContain("CALLE JIMÉNEZ TANIA ELIZABETH");
      expect(component.aulas.length).toBe(3);
      expect(component.aulas).toContain("AULA 101");
      expect(component.grupos.length).toBe(3);
      expect(component.grupos).toContain("GR2CC");
      expect(component.materias.length).toBe(3);
      expect(component.materias).toContain("APLICACIONES WEB");
    });
  });

  describe("Funcionalidad de filtros", () => {
    beforeEach(() => {
      component.horarios = mockHorarios;
      component.horariosFiltrados = [...mockHorarios];
    });

    it("should toggle filters visibility", () => {
      expect(component.mostrarFiltros).toBeFalse();

      component.toggleFiltros();
      expect(component.mostrarFiltros).toBeTrue();

      component.toggleFiltros();
      expect(component.mostrarFiltros).toBeFalse();
    });

    it("should filter by profesor", () => {
      spyOn(component, "procesarHorarios");

      component.filtroProfesor.setValue("CALLE");
      component.aplicarFiltros();

      expect(component.horariosFiltrados.length).toBe(1);
      expect(component.horariosFiltrados[0].profesor).toContain("CALLE");
      expect(component.procesarHorarios).toHaveBeenCalled();
    });

    it("should filter by aula", () => {
      spyOn(component, "procesarHorarios");

      component.filtroAula.setValue("LABORATORIO");
      component.aplicarFiltros();

      expect(component.horariosFiltrados.length).toBe(1);
      expect(component.horariosFiltrados[0].aula).toContain("LABORATORIO");
      expect(component.procesarHorarios).toHaveBeenCalled();
    });

    it("should filter by grupo", () => {
      spyOn(component, "procesarHorarios");

      component.filtroGrupo.setValue("GR2CC");
      component.aplicarFiltros();

      expect(component.horariosFiltrados.length).toBe(1);
      expect(component.horariosFiltrados[0].grupo).toBe("GR2CC");
      expect(component.procesarHorarios).toHaveBeenCalled();
    });

    it("should filter by materia", () => {
      spyOn(component, "procesarHorarios");

      component.filtroMateria.setValue("BASES DE DATOS");
      component.aplicarFiltros();

      expect(component.horariosFiltrados.length).toBe(1);
      expect(component.horariosFiltrados[0].materia).toBe("BASES DE DATOS");
      expect(component.procesarHorarios).toHaveBeenCalled();
    });

    it("should apply multiple filters", () => {
      spyOn(component, "procesarHorarios");

      component.filtroProfesor.setValue("BENALCÁZAR");
      component.filtroAula.setValue("LABORATORIO");
      component.aplicarFiltros();

      expect(component.horariosFiltrados.length).toBe(1);
      expect(component.horariosFiltrados[0].profesor).toContain("BENALCÁZAR");
      expect(component.horariosFiltrados[0].aula).toContain("LABORATORIO");
    });

    it("should clear all filters", () => {
      component.filtroProfesor.setValue("test");
      component.filtroAula.setValue("test");
      component.filtroGrupo.setValue("test");
      component.filtroMateria.setValue("test");

      component.limpiarFiltros();

      expect(component.filtroProfesor.value).toBe("");
      expect(component.filtroAula.value).toBe("");
      expect(component.filtroGrupo.value).toBe("");
      expect(component.filtroMateria.value).toBe("");
    });

    it("should return empty array when no matches", () => {
      spyOn(component, "procesarHorarios");

      component.filtroProfesor.setValue("PROFESOR INEXISTENTE");
      component.aplicarFiltros();

      expect(component.horariosFiltrados.length).toBe(0);
    });
  });

  describe("Procesamiento de horarios", () => {
    beforeEach(() => {
      component.horariosFiltrados = mockHorarios;
    });

    it("should process horarios into table format", () => {
      component.procesarHorarios();

      expect(component.datoFilasTabla.data.length).toBe(14); // 14 horas
      expect(component.datoFilasTabla.data[0].hora).toBe("07:00");
      expect(component.datoFilasTabla.data[0].lunes).toEqual(mockHorarios[0]); // Primera clase es lunes 7-9
    });

    it("should handle horarios spanning multiple hours", () => {
      const horarioLargo: Horario = {
        id: "4",
        profesor: "TEST PROFESOR",
        aula: "AULA TEST",
        grupo: "GR1",
        materia: "MATERIA TEST",
        dia: "Lunes",
        hora_inicio: "10:00:00",
        hora_fin: "13:00:00", // 3 horas
        semestre: "2025-A",
      };

      component.horariosFiltrados = [horarioLargo];
      component.procesarHorarios();

      const data = component.datoFilasTabla.data;
      const hora10 = data.find((row) => row.hora === "10:00");
      const hora11 = data.find((row) => row.hora === "11:00");
      const hora12 = data.find((row) => row.hora === "12:00");

      expect(hora10?.lunes).toEqual(horarioLargo);
      expect(hora11?.lunes).toEqual(horarioLargo);
      expect(hora12?.lunes).toEqual(horarioLargo);
    });
  });

  describe("Utilidades", () => {
    it("should calculate correct rowspan", () => {
      const horario: Horario = {
        id: "1",
        profesor: "Test",
        aula: "Test",
        grupo: "Test",
        materia: "Test",
        dia: "Lunes",
        hora_inicio: "09:00:00",
        hora_fin: "11:00:00",
        semestre: "2025-A",
      };

      const rowspan = component.calcularRowspan(horario);
      expect(rowspan).toBe(2);
    });

    it("should return 1 for null horario", () => {
      const rowspan = component.calcularRowspan(null);
      expect(rowspan).toBe(1);
    });

    it("should determine when to show content", () => {
      const horario: Horario = {
        id: "1",
        profesor: "Test",
        aula: "Test",
        grupo: "Test",
        materia: "Test",
        dia: "Lunes",
        hora_inicio: "09:00:00",
        hora_fin: "11:00:00",
        semestre: "2025-A",
      };

      expect(component.deberMostrarContenido(horario, "09:00")).toBeTrue();
      expect(component.deberMostrarContenido(horario, "10:00")).toBeFalse();
      expect(component.deberMostrarContenido(null, "09:00")).toBeFalse();
    });

    it("should get filter text correctly", () => {
      component.filtroProfesor.setValue("TEST PROFESOR");
      component.filtroAula.setValue("AULA 101");

      const filterText = component["obtenerTextoFiltros"]();
      expect(filterText).toContain("Profesor: TEST PROFESOR");
      expect(filterText).toContain("Aula: AULA 101");
    });

    it("should return empty string when no filters applied", () => {
      const filterText = component["obtenerTextoFiltros"]();
      expect(filterText).toBe("");
    });
  });

  describe("Navegación", () => {
    it("should go back to previous screen", () => {
      component.regresarPantallaAnterior();
      expect(mockLocation.back).toHaveBeenCalled();
    });
  });

  describe("Descarga de reportes", () => {
    beforeEach(() => {
      component.horarios = mockHorarios;
      component.horariosFiltrados = mockHorarios.slice(0, 1); // Solo un horario filtrado
    });

    it("should call descargarExcel method", () => {
      spyOn(component, "descargarExcel");

      // Simular click en el menú
      component.descargarExcel();

      expect(component.descargarExcel).toHaveBeenCalled();
    });

    it("should call descargarPDF method", () => {
      spyOn(component, "descargarPDF");

      // Simular click en el menú
      component.descargarPDF();

      expect(component.descargarPDF).toHaveBeenCalled();
    });
  });

  describe("Integración de filtros reactivos", () => {
    it("should call aplicarFiltros when form controls change", (done) => {
      spyOn(component, "aplicarFiltros");

      component.configurarFiltros();

      component.filtroProfesor.setValue("test");

      // Usar setTimeout para permitir que los observables se procesen
      setTimeout(() => {
        expect(component.aplicarFiltros).toHaveBeenCalled();
        done();
      }, 100);
    });
  });
});
```
