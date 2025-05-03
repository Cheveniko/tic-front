import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisualizarCarreraComponent } from './componentes/visualizar-carrera/visualizar-carrera.component';

const routes: Routes = [
    {
        path: '',
        component: VisualizarCarreraComponent
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
export class CarrerasRoutingModule { }
