import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog"
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table"
import { MatTabsModule } from "@angular/material/tabs"
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";


import { CrearTipoAulaDialogComponent } from "./components/tipo-aulas/crear-tipo-aula-dialog/crear-tipo-aula-dialog.component";
import { JornadaLaboralComponent } from './components/jornada-laboral/jornada-laboral.component';
import { ParametrosInicialesComponent } from "./pages/parametros-iniciales.component";
import { ParametrosInicialesRoutingModule } from "./parametros-inciales-routing.module";
import { TipoAulasComponent } from './components/tipo-aulas/tipo-aulas.component';
import { SemestreService } from "./services/semestre-api.service";
import { EditarTipoAulaDialogComponent } from './components/tipo-aulas/editar-tipo-aula-dialog/editar-tipo-aula-dialog.component';


@NgModule({
    declarations: [
        JornadaLaboralComponent,
        ParametrosInicialesComponent,
        TipoAulasComponent,
        CrearTipoAulaDialogComponent,
        EditarTipoAulaDialogComponent,
    ],
    imports: [
        CommonModule,
        MatCardModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatListModule,
        MatInputModule,
        MatSelectModule,
        MatTableModule,
        MatTabsModule,
        ParametrosInicialesRoutingModule,
        ReactiveFormsModule,
    ],
    providers: [
        SemestreService
    ]
})
export class ParametrosInicialesModule { }