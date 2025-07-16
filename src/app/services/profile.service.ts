import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  plan?: string;
  accepted_terms: boolean;
}

export interface ProfileDto {
  id: number;
  perfil: string;
}

export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  plan: string;
  accepted_terms: boolean;
  idPerfil: number;
}

@Injectable({ providedIn: 'root' })
export class ProfilesService {
  private api = `${environment.apiBackendUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.api}`);
  }

  updateUserProfile(userId: number, idPerfil: number): Observable<any> {
    return this.http.patch(`${this.api}/${userId}`, { idPerfil });
  }

  createUser(data: CreateUserDto): Observable<any> {
    return this.http.post(`${environment.apiBackendUrl}/auth/register`, data);
  }
}
