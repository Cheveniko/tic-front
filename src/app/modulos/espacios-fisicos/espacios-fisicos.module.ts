import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EspaciosFisicosRoutingModule } from "./espacios-fisicos-routing.module";
import { MostrarEspaciosFisicosComponent } from "./componentes/mostrar-espacios-fisicos/mostrar-espacios-fisicos.component";
import { CrearEspacioFisicoComponent } from "./componentes/crear-espacio-fisico/crear-espacio-fisico.component";

import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";

import { ActualizarEspacioFisicoComponent } from "./componentes/actualizar-espacio-fisico/actualizar-espacio-fisico.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    MostrarEspaciosFisicosComponent,
    CrearEspacioFisicoComponent,
    ActualizarEspacioFisicoComponent,
  ],
  imports: [
    CommonModule,
    EspaciosFisicosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTooltipModule,
  ],
})
export class EspaciosFisicosModule {}
