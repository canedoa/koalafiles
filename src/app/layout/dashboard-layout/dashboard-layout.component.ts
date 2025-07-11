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
import { MatIconButton } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { FileListComponent } from '../../dashboard/file-list.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FilesService } from '../../services/files.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconButton,
    MatIconModule,
    MatSidenavModule,
    SidebarComponent,
    FileListComponent,
    MatDialogModule,
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss'],
})
export class DashboardLayoutComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild(FileListComponent) fileList!: FileListComponent;

  userName = signal<string>('Cargando…');
  collapsed = signal(false);
  sidenavWidth = computed(() => (this.collapsed() ? '65px' : '250px'));

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
        // Si tu backend te envía name, úsalo; de lo contrario, el email
        this.userName.set(me.name ?? me.email);
      },
      error: (err) => {
        console.error('Error cargando perfil:', err);
        this.router.navigate(['/login']);
      },
    });
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
        this.filesSvc.mkdir(name).subscribe({
          next: () => {
            Swal.fire('Carpeta creada', `"${name}" ha sido creada.`, 'success');
            this.fileList.loadFiles();
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
  onFileSelected(ev: Event) {
    const inp = ev.target as HTMLInputElement;
    if (!inp.files?.length) return;
    const file = inp.files[0];
    this.filesSvc.upload(file).subscribe({
      next: () => {
        this.fileList.loadFiles();
        inp.value = '';
      },
      error: (e) => console.error('Error subiendo archivo', e),
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
