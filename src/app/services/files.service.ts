import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpParams } from '@angular/common/http';

export interface FileItem {
  nombre: string;
  tipo: 'archivo' | 'carpeta';
}

@Injectable({ providedIn: 'root' })
export class FilesService {
  private apiUrl = `${environment.apiBackendUrl}/files`;

  constructor(private http: HttpClient) {}

  /** Lista carpetas y archivos del usuario autenticado */
  getFiles(path: string[] = []): Observable<FileItem[]> {
    let params = new HttpParams();
    if (path.length) {
      params = params.set('path', path.join('/'));
    }
    return this.http.get<FileItem[]>(this.apiUrl, { params });
  }

  /** Crea una subcarpeta */
  mkdir(name: string, path: string[] = []): Observable<any> {
    return this.http.post(`${this.apiUrl}/mkdir`, {
      name,
      path: path.join('/'),
    });
  }

  /** Sube un archivo */
  upload(file: File, path: string[] = []): Observable<any> {
    const form = new FormData();
    form.append('file', file, file.name);
    form.append('path', path.join('/'));
    return this.http.post(`${this.apiUrl}/upload`, form);
  }
}
