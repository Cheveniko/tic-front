import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private readonly httpClient: HttpClient
  ) { }

  login(correo: string, clave: string): Observable<any> {
    return this.httpClient.post(
      apiUrl + '/auth/login',
      {
        "correo": correo,
        "clave": clave,
      },
      httpOptions
    );
  }

  verificarToken(access_token: string): Observable<any> {
    const url = apiUrl + '/auth/verificarToken/' + access_token;
    return this.httpClient.get(url);
  }

}
