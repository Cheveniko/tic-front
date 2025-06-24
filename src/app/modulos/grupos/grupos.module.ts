import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { GruposRoutingModule } from "./grupos-routing.module";
import { MostrarGruposComponent } from "./componentes/mostrar-grupos/mostrar-grupos.component";
import { MatList, MatListModule } from "@angular/material/list";
import { CrearGrupoDialogComponent } from "./componentes/crear-grupo-dialog/crear-grupo-dialog.component";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormField, MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatMenuModule } from "@angular/material/menu";

@NgModule({
  declarations: [MostrarGruposComponent, CrearGrupoDialogComponent],
  imports: [
    CommonModule,
    MatMenuModule,
    GruposRoutingModule,
    FormsModule,
    MatCardModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatListModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
  ],
})
export class GruposModule {}
