import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { VisualizarDocentesComponent } from "./componentes/visualizar-docentes/visualizar-docentes.component";
import { VisualizarHorarioComponent } from "../reportes/componentes/visualizar-horario/visualizar-horario.component";
import { ModificarHorasNoDisponiblesComponent } from "./componentes/modificar-horas-no-disponibles/modificar-horas-no-disponibles.component";
const routes: Routes = [
  {
    path: "horario-docente/:id",
    component: ModificarHorasNoDisponiblesComponent,
  },
  {
    path: "",
    component: VisualizarDocentesComponent,
  },
  {
    path: "**",
    redirectTo: "",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocentesRoutingModule {}
