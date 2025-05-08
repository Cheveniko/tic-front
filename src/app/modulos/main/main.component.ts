import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RolesEnum } from "src/app/servicios/auth/enum/roles.enum";
import { Usuario } from "src/app/servicios/auth/models/usuario.model";
import { TokenStorageService } from "src/app/servicios/auth/token-storage.service";
import { UsuarioStorageService } from "src/app/servicios/auth/usuario-storage.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit {
  constructor(
    private readonly tokenService: TokenStorageService,
    private readonly usuarioService: UsuarioStorageService,
    private readonly router: Router,
  ) {}

  usuario?: Usuario;
  mostrarMenuAcciones: boolean = true;

  ngOnInit(): void {
    this.usuario = this.usuarioService.obtenerUsuario();
  }

  cerrarSesion() {
    this.tokenService.cerrarSesion();

    const toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: false,
    });

    this.router.navigate(["/login"]);

    toast.fire({
      icon: "info",
      title: "Hasta luego",
    });
  }

  toogleMenuAcciones() {
    this.mostrarMenuAcciones = !this.mostrarMenuAcciones;
  }

  mostrarRutaActiva(ruta: string) {
    const rutaActual = this.router.url;
    return rutaActual.includes(ruta) ? "active" : "";
  }

  esCoordinador() {
    return this.usuarioService.obtenerRoles().includes(RolesEnum.COORDINADOR);
  }

  esAsistenteAcademico() {
    return this.usuarioService
      .obtenerRoles()
      .includes(RolesEnum.ASISTENTE_ACADEMICO);
  }

  esDocente() {
    return this.usuarioService.obtenerRoles().includes(RolesEnum.DOCENTE);
  }

  esSubdecano() {
    return this.usuarioService.obtenerRoles().includes(RolesEnum.SUBDECANO);
  }

  esGestorEspaciosFisicos() {
    return this.usuarioService
      .obtenerRoles()
      .includes(RolesEnum.GESTOR_ESPACIOS_FISICOS);
  }

  esJefeDeDepartamento() {
    return this.usuarioService
      .obtenerRoles()
      .includes(RolesEnum.JEFE_DE_DEPARTAMENTO);
  }
}
