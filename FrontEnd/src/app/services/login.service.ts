import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ilogin } from '../interface/ilogin';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly tokenKey = 'token';

  constructor(private http: HttpClient) { }
  
  /**
   * Realiza el login consumiendo el API y devuelve directamente el token (texto plano).
   */
  login(data: Ilogin): Observable<string> {
    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);

    return this.http.get(
      `${environment.urlbackend}api/Login/Login`,
      { params, responseType: 'text' }
    );
  }

  /**
   * Guarda el token en sessionStorage.
   */
  saveToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  /**
   * Extrae el correo del payload del JWT almacenado.
   */
  getEmailFromToken(): string {
    const token = sessionStorage.getItem(this.tokenKey);
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['email'] || '';
    } catch {
      return '';
    }
  }
}
