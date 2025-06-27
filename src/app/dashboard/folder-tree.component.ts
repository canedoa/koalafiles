import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-folder-tree',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, MatDividerModule],
  templateUrl: 'folder-tree.component.html',
  styleUrls: ['folder-tree.component.scss'],
})
export class FolderTreeComponent {
  folders = ['Mis documentos', 'Facturas', 'Imágenes', 'Proyectos'];
}
