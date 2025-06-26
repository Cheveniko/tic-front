import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RegistrarNumeroEstudiantesPorAsignaturaComponent } from "./componentes/registrar-numero-estudiantes-por-asignatura/registrar-numero-estudiantes-por-asignatura.component";

const routes: Routes = [
  {
    path: "",
    component: RegistrarNumeroEstudiantesPorAsignaturaComponent,
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
export class NumeroEstudiantesRoutingModule {}
