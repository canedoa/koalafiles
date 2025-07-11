

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FilesService } from '../services/files.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

export interface FileItem {
  nombre: string;
  tipo: 'archivo' | 'carpeta';
}
@Component({
  selector: 'app-file-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule],
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
})
export class FileListComponent implements OnChanges {
  /** La ruta actual (lista de carpetas desde la raíz) */
  @Input() path: string[] = [];

  /** Emite el nombre de la carpeta seleccionada */
  @Output() folderClick = new EventEmitter<string>();

  files: FileItem[] = [];

  constructor(private filesSvc: FilesService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['path']) {
      // cada vez que path cambie, limpio y recargo
      this.files = [];
      this.filesSvc.getFiles(this.path).subscribe({
        next: (list) => (this.files = list),
        error: (err) => console.error('Error al listar archivos', err),
      });
    }
  }

  /** Recarga la lista desde el backend, pasandole la ruta */
  // src/app/dashboard/file-list.component.ts

loadFiles(path: string[] = []) {
  // Limpia la lista inmediatamente
  this.files = [];

  // Pide al backend los archivos de la ruta dada
  this.filesSvc.getFiles(path).subscribe({
    next: (list) => {
      // Una vez que venga la respuesta, reemplaza por completo
      this.files = list;
    },
    error: (err) => console.error('Error al listar archivos', err),
  });
}

  /** Si es carpeta, emitimos para que el padre navegue dentro */
  onItemClick(item: FileItem) {
    if (item.tipo === 'carpeta') {
      this.folderClick.emit(item.nombre);
    } else {
      // aquí podrías descargar o previsualizar el archivo
      console.log('Archivo clicado:', item.nombre);
    }
  }
}
