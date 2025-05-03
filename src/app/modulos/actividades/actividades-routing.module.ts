import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MostrarActividadesComponent } from './componentes/mostrar-actividades/mostrar-actividades.component';
import { RestriccionLugarTiempoComponent } from './componentes/restriccion-lugar-tiempo/restriccion-lugar-tiempo.component';
import { CrearActividadComponent } from './componentes/crear-actividad/crear-actividad.component';
import { ActualizarActividadComponent } from './componentes/actualizar-actividad/actualizar-actividad.component';

const routes: Routes = [
  {
    path: ':id/restricciones',
    component: RestriccionLugarTiempoComponent,
  },
  {
    path: '',
    component: MostrarActividadesComponent,
  },
  {
    path: 'crear-actividad',
    component: CrearActividadComponent,
  },
  {
    path: ':id/actualizar-actividad',
    component: ActualizarActividadComponent
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActividadesRoutingModule { }
