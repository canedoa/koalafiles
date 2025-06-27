import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-file-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: 'file-list.component.html',
  styleUrls: ['file-list.component.scss'],
})
export class FileListComponent {
  columns = ['name', 'size', 'uploadedAt', 'actions'];

  files = [
    {
      name: 'factura-enero.pdf',
      size: 1048576,
      uploadedAt: new Date(),
    },
    {
      name: 'reporte.docx',
      size: 210432,
      uploadedAt: new Date(),
    },
    {
      name: 'imagen.png',
      size: 587312,
      uploadedAt: new Date(),
    },
  ];

  formatSize(sizeInBytes: number): string {
    const kb = sizeInBytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  }
}
