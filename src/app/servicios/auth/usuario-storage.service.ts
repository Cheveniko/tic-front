import { Injectable } from "@angular/core";
import { Usuario } from "./models/usuario.model";

const USUARIO_KEY = "usuario";

@Injectable({
  providedIn: "root",
})
export class UsuarioStorageService {
  constructor() {}

  guardarUsuario(usuario: Usuario) {
    window.sessionStorage.removeItem(USUARIO_KEY);
    window.sessionStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
  }

  obtenerUsuario(): Usuario {
    const usuario = window.sessionStorage.getItem(USUARIO_KEY);
    return usuario ? JSON.parse(usuario) : {};
  }

  obtenerRoles() {
    const usuarioAlmacenado = window.sessionStorage.getItem(USUARIO_KEY);
    if (usuarioAlmacenado) {
      const usuario = JSON.parse(usuarioAlmacenado) as Usuario;
      return usuario.roles;
    }
    return [];
  }
}
