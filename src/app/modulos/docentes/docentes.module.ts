import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActualizarDocenteComponent } from './componentes/actualizar-docente/actualizar-docente.component';
import { CrearDocenteComponent } from './componentes/crear-docente/crear-docente.component';
import { VisualizarDocentesComponent } from './componentes/visualizar-docentes/visualizar-docentes.component';
import { DocentesRoutingModule } from './docentes-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ModificarHorasNoDisponiblesComponent } from './componentes/modificar-horas-no-disponibles/modificar-horas-no-disponibles.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { ActividadesModule } from '../actividades/actividades.module';

@NgModule({
  declarations: [
    ActualizarDocenteComponent,
    CrearDocenteComponent,
    VisualizarDocentesComponent,
    ModificarHorasNoDisponiblesComponent
  ],
  imports: [
    CommonModule,
    DocentesRoutingModule,
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
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatCardModule,
    MatPaginatorModule,
    MatIconModule,
    MatSortModule,
    MatTooltipModule,
    ActividadesModule
  ]
})
export class DocentesModule { }
