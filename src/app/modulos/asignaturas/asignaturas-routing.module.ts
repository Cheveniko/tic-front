import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { VisualizarAsignaturaComponent } from "./componentes/visualizar-asignatura/visualizar-asignatura.component";

const routes: Routes = [
  {
    path: "",
    component: VisualizarAsignaturaComponent,
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
export class AsignaturasRoutingModule {}
