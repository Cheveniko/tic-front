import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MostrarActividadesComponent } from './componentes/mostrar-actividades/mostrar-actividades.component';
import { ActividadesRoutingModule } from './actividades-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { CrearActividadDialogComponent } from './componentes/crear-actividad-dialog/crear-actividad-dialog.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field'; 
import { MatSelectModule } from '@angular/material/select';
import { RestriccionLugarTiempoComponent } from './componentes/restriccion-lugar-tiempo/restriccion-lugar-tiempo.component';
import { CrearActividadComponent } from './componentes/crear-actividad/crear-actividad.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActualizarActividadComponent } from './componentes/actualizar-actividad/actualizar-actividad.component';
import { ActividadesApiService } from './servicios/actividades_api.service';
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 

@NgModule({
  declarations: [
    MostrarActividadesComponent,
    CrearActividadDialogComponent,
    RestriccionLugarTiempoComponent,
    CrearActividadComponent,
    ActualizarActividadComponent,
  ],
  imports: [
    CommonModule,
    ActividadesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatTableModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatDialogModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule
  ],
})
export class ActividadesModule { }
