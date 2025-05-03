import { Component } from "@angular/core";
import Semestre from "../models/semestre.interface";
import { SemestreService } from "../services/semestre-api.service";


@Component({
    selector: 'app-parametros-iniciales',
    templateUrl: './parametros-iniciales.component.html',
    styleUrls: ['./paremtros-iniciales.component.scss']
})
export class ParametrosInicialesComponent{
    constructor(
    ) {}
}