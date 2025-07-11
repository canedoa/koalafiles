import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FilesService {
  private apiUrl = `${environment.apiBackendUrl}/files`;

  constructor(private http: HttpClient) {}

  /** Lista carpetas y archivos del usuario autenticado */
  getFiles(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl);
  }

  /** Crea una subcarpeta */
  mkdir(name: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/mkdir`, { name });
  }

  /** Sube un archivo */
  upload(file: File): Observable<{ filename: string }> {
    const form = new FormData();
    form.append('file', file, file.name);
    return this.http.post<{ filename: string }>(`${this.apiUrl}/upload`, form);
  }
}
