import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActualizarCarreraComponent } from './componentes/actualizar-carrera/actualizar-carrera.component';
import { CrearCarreraComponent } from './componentes/crear-carrera/crear-carrera.component';
import { VisualizarCarreraComponent } from './componentes/visualizar-carrera/visualizar-carrera.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CarrerasRoutingModule } from './carrera-routing.module';

@NgModule({
  declarations: [
    ActualizarCarreraComponent,
    CrearCarreraComponent,
    VisualizarCarreraComponent
  ],
  imports: [
    CommonModule,
    CarrerasRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatGridListModule,
    MatSortModule,
    MatSelectModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTooltipModule,
  ]
})
export class CarreraModule { }
