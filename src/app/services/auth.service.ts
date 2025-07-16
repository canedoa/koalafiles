import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; //permite realizar peticiones HTTP (GET, POST, etc.)
import { Observable } from 'rxjs'; //representa una respuesta asincrónica, en angular las peticiones devuelven "Observable"
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}
export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  // Si tu API devolviera token + user aquí podrías reusar LoginResponse
}

export interface MeResponse {
  userId: number;
  email: string;
  name?: string;
  idPerfil: number;
}
@Injectable({
  providedIn: 'root', //providedIn: 'root' indica que este servicio estará disponible globalmente en toda la aplicación
})
export class AuthService {
  //Declara la clase AuthService. Aquí se centralizarán todas las operaciones de autenticación.
  private apiUrl = `${environment.apiBackendUrl}/auth`;

  constructor(private http: HttpClient) {
    // angular guarda directamente como propiedad http
    //Inyecta el servicio HttpClient en el constructor
    //El constructor es parte de Typescript y su funcion es ejecutar automaticamente
    // cuando se crea una instancia de una clase
  }

  login(credentials: {
    email: string;
    password: string;
  }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          this.saveToken(response.token); // <-- Guardar token automáticamente al iniciar sesión
        })
      );
  }

  //metodo register
  register(data: RegisterDto): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, data);
  }

  // Método adicional para guardar el token
  saveToken(token: string): void {
    localStorage.setItem('auth_token', token); //Guarda datos en la computadora del usuario, y permanecen hasta que se borren manualmente
  }
  getToken(): string | null {
    //Si no existe (por ejemplo, si ya cerró sesión), devuelve null
    return localStorage.getItem('auth_token'); //Recupera el token guardado anteriormente
  }

  logout(): void {
    localStorage.removeItem('auth_token'); //Elimina el token guardado,es decir, cierra la sesión del usuario
  }
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  me(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${this.apiUrl}/me`);
  }
}
