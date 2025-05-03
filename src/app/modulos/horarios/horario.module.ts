import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisualizarHorarioComponent } from './componentes/visualizar-horario/visualizar-horario.component';
import { VisualizarListaHorariosComponent } from './componentes/visualizar-lista-horarios/visualizar-lista-horarios.component';

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
import { HorariosRoutingModule } from './horario-routing.module';
import { MatTableExporterModule } from 'mat-table-exporter';

@NgModule({
    declarations: [
        VisualizarHorarioComponent,
        VisualizarListaHorariosComponent
    ],
    imports: [
        CommonModule,
        HorariosRoutingModule,
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
    MatTableExporterModule,

    ]
})
export class HorarioModule { }
