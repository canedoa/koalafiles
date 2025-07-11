// src/app/dashboard/file-list.component.ts

import { Component, OnInit } from '@angular/core';
import { FilesService } from '../services/files.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-file-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule],
  template: `
    <div class="file-grid">
      <mat-card class="file-card" *ngFor="let name of files">
        <mat-icon>
          {{ name.includes('.') ? 'insert_drive_file' : 'folder' }}
        </mat-icon>
        <p>{{ name }}</p>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .file-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 1rem;
        padding: 1rem;
      }
      .file-card {
        text-align: center;
        padding: 0.5rem;
        background-color:rgb(207, 237, 250);
        transition: transform 0.3s ease;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }
      .file-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
      }
      mat-icon {
        font-size: 40px;
        display: block;
        margin-bottom: 0.5rem;
        color: #ffb6c1;
      }
    `,
  ],
})
export class FileListComponent implements OnInit {
  files: string[] = [];

  constructor(private filesSvc: FilesService) {}

  ngOnInit() {
    // delegamos la carga al nuevo método
    this.loadFiles();
  }

  /**
   * Método público que recarga la lista de archivos.
   * Lo puede llamar el componente padre (DashboardLayout).
   */
  loadFiles(): void {
    console.log('Cargando lista de archivos…');
    this.filesSvc.getFiles().subscribe({
      next: (list) => {
        console.log('Lista recibida:', list);
        this.files = list;
      },
      error: (err) => console.error('Error al listar archivos', err),
    });
  }
}
