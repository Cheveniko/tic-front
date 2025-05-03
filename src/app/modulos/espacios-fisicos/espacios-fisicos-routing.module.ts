import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MostrarEspaciosFisicosComponent } from './componentes/mostrar-espacios-fisicos/mostrar-espacios-fisicos.component';

const routes: Routes = [
  {
    path: '',
    component: MostrarEspaciosFisicosComponent,
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
export class EspaciosFisicosRoutingModule { }
