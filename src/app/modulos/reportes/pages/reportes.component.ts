import { Component } from "@angular/core";

@Component({
  selector: "app-reportes",
  templateUrl: "./reportes.component.html",
  styleUrls: ["./reportes.component.scss"],
})
export class ReportesComponent {
  carreras: string[] = ['Ingeniería de Sistemas', 'Ingeniería Industrial', 'Ingeniería Civil', 'Arquitectura'];

  constructor() {}
}
