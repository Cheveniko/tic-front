import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MostrarGruposComponent } from './componentes/mostrar-grupos/mostrar-grupos.component';

const routes: Routes = [
    {
        path: '',
        component: MostrarGruposComponent,
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
export class GruposRoutingModule { }
