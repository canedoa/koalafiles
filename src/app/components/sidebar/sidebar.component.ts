import {
  Component,
  Input,
  signal,
  computed,
 
  
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Output, EventEmitter } from '@angular/core';

export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
};

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() profileId!: number;
  @Output() newFolder = new EventEmitter<void>();
  @Output() uploadFile = new EventEmitter<void>();
  @Output() itemSelected = new EventEmitter<void>();
  @Output() showProfiles = new EventEmitter<void>();
   @Output() profileClick = new EventEmitter<void>();
  onNewFolderClick() {
    this.newFolder.emit();
  }

  onUploadClick() {
    this.uploadFile.emit();
  }
  onItemClick() {
    this.itemSelected.emit();
  }

  sideNavCollapsed = signal(false);

  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val);
  }

  menuItems = signal<MenuItem[]>([
    {
      icon: 'folder',
      label: 'Mis Archivos',
      route: 'dashboard',
    },
    {
      icon: 'people',
      label: 'Compartidos',
      route: 'dashboard',
    },
    {
      icon: 'delete',
      label: 'Papeleria',
      route: 'dashboard',
    },
  ]);

  profilePicSize = computed(() => ({
    width: this.sideNavCollapsed() ? '55px' : '141px',
    height: this.sideNavCollapsed() ? '50px' : '101px',
  }));
}
