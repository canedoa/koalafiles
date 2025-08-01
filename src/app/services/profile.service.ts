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
  iActivo: number;
}

@Injectable({ providedIn: 'root' })
export class ProfilesService {
  private api = `${environment.apiBackendUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.api}`);
  }

  getUserPermissions(userId: number) {
    return this.http.get<{ createFolder: boolean; uploadFile: boolean }>(
      `${this.api}/${userId}/permissions`
    );
  }

  updateUserPermissions(
    userId: number,
    permissions: { createFolder: boolean; uploadFile: boolean }
  ): Observable<any> {
    return this.http.patch(`${this.api}/${userId}/permissions`, permissions);
  }

  updateUserProfile(
    userId: number,
    idPerfil: number,
    iActivo: number
  ): Observable<any> {
    return this.http.patch(`${this.api}/${userId}`, { idPerfil, iActivo });
  }

  createUser(data: CreateUserDto): Observable<any> {
    return this.http.post(`${environment.apiBackendUrl}/auth/register`, data);
  }
}
