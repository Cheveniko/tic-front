import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { RolesEnum } from "../enum/roles.enum";
import { UsuarioStorageService } from "../usuario-storage.service";

@Injectable()
export class EsGestorEspaciosFisicosGuard implements CanActivate, CanActivateChild{

    constructor(
        private readonly userService: UsuarioStorageService,
        private readonly router: Router,
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.tieneRolGestorEspaciosFisicos();
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.tieneRolGestorEspaciosFisicos();
    }

    tieneRolGestorEspaciosFisicos() {

        const roles = this.userService.obtenerRoles();

        if (!roles) {
            return true;
        }
        if (!roles.includes(RolesEnum.GESTOR_ESPACIOS_FISICOS)) {
            this.router.navigate(['/spa']);
        }

        return roles.includes(RolesEnum.GESTOR_ESPACIOS_FISICOS);
    }        

}