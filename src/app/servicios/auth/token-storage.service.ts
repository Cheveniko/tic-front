import { Injectable } from '@angular/core';

const TOKEN_KEY = 'access_token';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  guardarToken(token: string) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  obtenerToken() {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  cerrarSesion() {
    window.sessionStorage.clear();
  }

}
