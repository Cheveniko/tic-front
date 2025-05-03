import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { RolesEnum } from "../enum/roles.enum";
import { UsuarioStorageService } from "../usuario-storage.service";

@Injectable()
export class EsCoordinadorGuard implements CanActivate, CanActivateChild{

    constructor(
        private readonly userService: UsuarioStorageService,
        private readonly router: Router,
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.tieneRolCoordinador();
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.tieneRolCoordinador();
    }

    tieneRolCoordinador() {
        console.log("tiene rol coordinador")
        const roles = this.userService.obtenerRoles();
        if (!roles) {
            return false;
        }
        if (!roles.includes(RolesEnum.ASISTENTE_ACADEMICO) && !roles.includes(RolesEnum.COORDINADOR)) {
        console.log("no es coordinador")
            this.router.navigate(['/spa']);
        }
        console.log("es coordinador")
        return roles.includes(RolesEnum.ASISTENTE_ACADEMICO) || roles.includes(RolesEnum.COORDINADOR);
    }

}