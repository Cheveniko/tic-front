import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrearAsignaturaComponent } from './componentes/crear-asignatura/crear-asignatura.component';
import { VisualizarAsignaturaComponent } from './componentes/visualizar-asignatura/visualizar-asignatura.component';
import { AsignaturasRoutingModule } from './asignaturas-routing.module';

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
import { ActualizarAsignaturaComponent } from './componentes/actualizar-asignatura/actualizar-asignatura.component';

@NgModule({
    declarations: [
        ActualizarAsignaturaComponent,
        CrearAsignaturaComponent,
        VisualizarAsignaturaComponent
    ],
    imports: [
        CommonModule,
        AsignaturasRoutingModule,
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
    ],
})
export class AsignaturasModule { }
