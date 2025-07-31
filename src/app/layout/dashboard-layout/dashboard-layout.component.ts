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
import { ProfilesService } from '../../services/profile.service';
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
import { PermissionsListComponent } from '../../dashboard/permissions-list/permissions-list.component';

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
    PermissionsListComponent,
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss'],
})
export class DashboardLayoutComponent implements OnInit {
  profileId = signal<number>(0); // ← nueva señal
  // Devuelve el idPerfil actual
  profileIdValue(): number {
    return this.profileId();
  }

  // Acción para mostrar la gestión de perfiles
  onShowProfiles(): void {
    this.showProfiles.set(true);
  }
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild(FileListComponent) fileList!: FileListComponent;

  userName = signal<string>('Cargando…');
  collapsed = signal(false);
  currentPath = signal<string[]>([]);
  sidenavWidth = computed(() => (this.collapsed() ? '65px' : '250px'));
  usedPercent = signal(0);
  isDragOver = signal(false);
  totalPercent = 100;
  progressPercent = signal(0);
  showProfiles = signal(false);
  userPermissions: { createFolder: boolean; uploadFile: boolean } | undefined =
    undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private filesSvc: FilesService,
    private profilesService: ProfilesService
  ) {}
  ngOnInit() {
    // Al iniciar: pedimos /auth/me
    this.authService.me().subscribe({
      next: (me: MeResponse) => {
        this.userName.set(me.name ?? me.email);
        this.profileId.set(me.idPerfil);
        // Obtener permisos del usuario logueado
        this.profilesService
          .getUserPermissions(me.userId)
          .subscribe((perms) => {
            console.log('Permisos recibidos en dashboard:', perms);
            this.userPermissions = perms;
          });
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

    // Procesar múltiples archivos (compatible con un solo archivo también)
    this.processFiles(input.files);

    // volver a resetear el input para poder subir el mismo archivo otra vez
    input.value = '';
  }

  // Procesar múltiples archivos (usado tanto por drag&drop como por el botón)
  private processFiles(files: FileList) {
    const fileArray = Array.from(files);

    if (fileArray.length === 0) return;

    // Si es un solo archivo, usa la lógica original
    if (fileArray.length === 1) {
      const file = fileArray[0];
      this.filesSvc.upload(file, this.currentPath()).subscribe({
        next: () => {
          this.refreshFiles();
        },
        error: (err) => console.error('Error subiendo archivo', err),
      });
      return;
    }

    // Si son múltiples archivos, mostrar progreso
    Swal.fire({
      title: 'Subiendo archivos...',
      text: `Subiendo ${fileArray.length} archivo(s)`,
      icon: 'info',
      showConfirmButton: false,
      timer: 2000,
    });

    fileArray.forEach((file, index) => {
      this.filesSvc.upload(file, this.currentPath()).subscribe({
        next: () => {
          if (index === fileArray.length - 1) {
            this.refreshFiles();
            Swal.fire({
              title: '¡Listo!',
              text: `${fileArray.length} archivo(s) subido(s) correctamente`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
            });
          }
        },
        error: (err) => {
          console.error('Error subiendo archivo', file.name, err);
        },
      });
    });
  }

  // MÉTODOS PARA DRAG & DROP
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragEnter(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget === event.target) {
      this.isDragOver.set(false);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFiles(files);
    }
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

  onBackToFiles() {
    this.showProfiles.set(false);
    this.showPermissions.set(false);
  }

  showPermissions = signal(false);
  users: any[] = []; // Aquí deberías cargar los usuarios reales

  onShowPermissions(): void {
    this.showPermissions.set(true);
    this.showProfiles.set(false);
    // Aquí deberías cargar los usuarios si no están cargados
  }
}
