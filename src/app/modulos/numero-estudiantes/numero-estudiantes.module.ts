import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RegistrarNumeroEstudiantesPorAsignaturaComponent } from "./componentes/registrar-numero-estudiantes-por-asignatura/registrar-numero-estudiantes-por-asignatura.component";
import { NumeroEstudiantesRoutingModule } from "./numero-estudiantes-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatMenuModule } from "@angular/material/menu";
import { MatIcon } from "@angular/material/icon";

@NgModule({
  declarations: [RegistrarNumeroEstudiantesPorAsignaturaComponent],
  imports: [
    CommonModule,
    MatMenuModule,
    MatIcon,
    NumeroEstudiantesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
  ],
})
export class NumeroEstudiantesModule {}
