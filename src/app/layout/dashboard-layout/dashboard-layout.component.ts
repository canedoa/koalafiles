import {
  Component,
  OnInit,
  signal,
  computed,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService, MeResponse } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { FileListComponent } from '../../dashboard/file-list.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FilesService } from '../../services/files.service';
import Swal from 'sweetalert2';
import { MatCardModule } from '@angular/material/card';
import { StorageProgressComponent } from '../../components/storage-progress/storage-progress.component';
import { ProfileListComponent } from '../../dashboard/profile-list/profile-list.component';
import { MatButtonModule } from '@angular/material/button'; 

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    SidebarComponent,
    FileListComponent,
    ProfileListComponent,
    MatDialogModule,
    MatCardModule,
    StorageProgressComponent,
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss'],
})
export class DashboardLayoutComponent implements OnInit {
  profileId = signal<number>(0);  // ← nueva señal
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild(FileListComponent) fileList!: FileListComponent;

  userName = signal<string>('Cargando…');
  collapsed = signal(false);
  currentPath = signal<string[]>([]);
  sidenavWidth = computed(() => (this.collapsed() ? '65px' : '250px'));
  usedPercent = signal(0);
  totalPercent = 100;
  progressPercent = signal(0);
  showProfiles = signal(false);
  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private filesSvc: FilesService
  ) {}
  ngOnInit() {
    // Al iniciar: pedimos /auth/me
    this.authService.me().subscribe({
      next: (me: MeResponse) => {
        this.userName.set(me.name ?? me.email);
        this.profileId.set(me.idPerfil);
      },
      error: (err) => {
        console.error('Error cargando perfil:', err);
        this.router.navigate(['/login']);
      },
    });
    this.refreshFiles();
  }

  onFolderClick(name: string) {
    const p = this.currentPath();
    if (p[p.length - 1] === name) return;
    this.currentPath.set([...p, name]);
    this.refreshFiles();
  }

  up() {
    const p = [...this.currentPath()];
    p.pop();
    this.currentPath.set(p);
  }

  // Nueva carpeta
  onNewFolder(): void {
    Swal.fire({
      title: 'Nueva carpeta',
      input: 'text',
      inputLabel: 'Nombre de la carpeta',
      inputPlaceholder: 'Escribe un nombre',
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return '¡El nombre no puede estar vacío!';
        }
        return null;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const name = result.value!.trim();
        this.filesSvc.mkdir(name, this.currentPath()).subscribe({
          next: () => {
            Swal.fire('¡Listo!', `"${name}" creada.`, 'success');
            this.fileList.loadFiles(this.currentPath()); // <-- recarga la ruta actual
            this.currentPath.update((path) => [...path]);
          },
          error: (err) => {
            console.error('Error al crear carpeta', err);
            Swal.fire('Error', 'No se pudo crear la carpeta.', 'error');
          },
        });
      }
    });
  }

  // Disparar diálogo file
  onFileUploadRequested() {
    this.fileInput.nativeElement.click();
  }

  //Cuando el usuario selecciona archivo
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }
    const file = input.files[0];
    this.filesSvc.upload(file, this.currentPath()).subscribe({
      next: () => {
        this.refreshFiles();
        // volver a resetear el input para poder subir el mismo archivo otra vez
        input.value = '';
      },
      error: (err) => console.error('Error subiendo archivo', err),
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  refreshFiles() {
    if (this.fileList) {
      this.fileList.loadFiles(this.currentPath());
      const count = this.fileList.files.length;
      // cada archivo = 5 %
      this.usedPercent.set(Math.min(this.totalPercent, count * 5));
    }
  }
  // Getter seguro para el número de archivos
  get fileCount(): number {
    return this.fileList?.files?.length ?? 0;
  }


  onShowProfiles() {
    this.showProfiles.set(true);
  }

  onBackToFiles() {
    this.showProfiles.set(false);
  }
}
