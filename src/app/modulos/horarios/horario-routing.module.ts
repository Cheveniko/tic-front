import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisualizarHorarioComponent } from './componentes/visualizar-horario/visualizar-horario.component';
import { VisualizarListaHorariosComponent } from './componentes/visualizar-lista-horarios/visualizar-lista-horarios.component';

const routes: Routes = [
    {
        path: '',
        component: VisualizarListaHorariosComponent
    },
    {
        path: 'visualizarHorario/:id',
        component: VisualizarHorarioComponent
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
export class HorariosRoutingModule { }
