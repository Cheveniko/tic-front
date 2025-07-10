import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./modulos/login/login/login.component";
import { BienvenidoComponent } from "./modulos/main/bienvenido/bienvenido.component";
import { MainComponent } from "./modulos/main/main.component";
import { EsCoordinadorGuard } from "./servicios/auth/guards/es-coordinador.guard";
import { EsAsistenteAcademicoGuard } from "./servicios/auth/guards/es-asistente-academico.guard";
import { LoggedGuard } from "./servicios/auth/guards/logged.guard";

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "spa",
    component: MainComponent,
    canActivate: [LoggedGuard],
    children: [
      {
        path: "",
        component: BienvenidoComponent,
      },
      {
        path: "parametros-iniciales",
        loadChildren: () =>
          import(
            "./modulos/parametros-inciales/paremetros-iniciales.module"
          ).then((m) => m.ParametrosInicialesModule),
      },
      {
        path: "espacios_fisicos",
        canActivateChild: [EsCoordinadorGuard, EsAsistenteAcademicoGuard],
        loadChildren: () =>
          import("./modulos/espacios-fisicos/espacios-fisicos.module").then(
            (m) => m.EspaciosFisicosModule,
          ),
      },
      {
        path: "numero_estudiantes_por_semestre",
        canActivateChild: [EsCoordinadorGuard, EsAsistenteAcademicoGuard],
        loadChildren: () =>
          import("./modulos/numero-estudiantes/numero-estudiantes.module").then(
            (m) => m.NumeroEstudiantesModule,
          ),
      },
      {
        path: "docentes",
        canActivateChild: [EsCoordinadorGuard, EsAsistenteAcademicoGuard],
        loadChildren: () =>
          import("./modulos/docentes/docentes.module").then(
            (m) => m.DocentesModule,
          ),
      },
      {
        path: "asignaturas",
        canActivateChild: [EsCoordinadorGuard, EsAsistenteAcademicoGuard],
        loadChildren: () =>
          import("./modulos/asignaturas/asignaturas.module").then(
            (m) => m.AsignaturasModule,
          ),
      },
      {
        path: "carreras",
        canActivateChild: [EsCoordinadorGuard, EsAsistenteAcademicoGuard],
        loadChildren: () =>
          import("./modulos/carreras/carrera.module").then(
            (m) => m.CarreraModule,
          ),
      },
      {
        path: "grupos",
        canActivateChild: [EsCoordinadorGuard, EsAsistenteAcademicoGuard],
        loadChildren: () =>
          import("./modulos/grupos/grupos.module").then((m) => m.GruposModule),
      },
      {
        path: "actividades",
        canActivateChild: [EsCoordinadorGuard, EsAsistenteAcademicoGuard],
        loadChildren: () =>
          import("./modulos/actividades/actividades.module").then(
            (m) => m.ActividadesModule,
          ),
      },
      {
        path: "reportes",
        canActivateChild: [EsCoordinadorGuard, EsAsistenteAcademicoGuard],
        loadChildren: () =>
          import("./modulos/reportes/reportes.module").then(
            (m) => m.ReportesModule,
          ),
      },

      // {
      //   path: "reportes",
      //   canActivateChild: [EsCoordinadorGuard, EsAsistenteAcademicoGuard],
      //   loadChildren: () =>
      //     import("./modulos/reportes/reportes.module").then(
      //       (m) => m.ReportesModule,
      //     ),
      // },
    ],
  },
  {
    path: "**",
    redirectTo: "spa",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
