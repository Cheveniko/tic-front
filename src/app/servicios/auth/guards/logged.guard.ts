import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { catchError, map, Observable, of } from "rxjs";
import Swal from "sweetalert2";
import { AuthService } from "../auth.service";
import { TokenStorageService } from "../token-storage.service";

@Injectable()
export class LoggedGuard implements CanActivate{

    constructor(
        private readonly tokenService: TokenStorageService,
        private readonly router: Router,
        private readonly authService: AuthService,
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        // Se obtiene el token del storage
        const token = this.tokenService.obtenerToken();

        // Si no hay token almacenado
        if (!token) {
            return false;
        }

        // Se verifica la validez del token
        return this.authService.verificarToken(token).pipe(
            // Si es válido
            map( () => {
                return true;
            }),
            // Si no es válido
            catchError( error => {
                // Vaciar sesión
                this.tokenService.cerrarSesion();

                // Redirigir al login
                this.router.navigate(['/login']);

                // Mensaje de error
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: false,
                });
            
                toast.fire({
                    icon: 'error',
                    title: '¡Acceso denegado!'
                });

                return of(false);
            })
        );
    }

}