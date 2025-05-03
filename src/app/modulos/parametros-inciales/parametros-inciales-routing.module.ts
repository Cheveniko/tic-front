import { ParametrosInicialesComponent } from './pages/parametros-iniciales.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes : Routes = [
    {
        path: '',
        component: ParametrosInicialesComponent,
    }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrosInicialesRoutingModule { }