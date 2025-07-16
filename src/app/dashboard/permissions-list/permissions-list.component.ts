import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { UserDto, ProfilesService } from '../../services/profile.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-permissions-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './permissions-list.component.html',
  styleUrl: './permissions-list.component.scss',
})
export class PermissionsListComponent {
  users: UserDto[] = [];
  permissions: {
    [userId: number]: { createFolder: boolean; uploadFile: boolean };
  } = {};

  constructor(private profilesService: ProfilesService) {}

  ngOnInit() {
    this.profilesService.getUsers().subscribe((users) => {
      this.users = users;
      users.forEach((u) => {
        this.profilesService.getUserPermissions(u.id).subscribe({
          next: (perms) => {
            this.permissions[u.id] = perms || {
              createFolder: false,
              uploadFile: false,
            };
          },
          error: () => {
            this.permissions[u.id] = { createFolder: false, uploadFile: false };
          },
        });
      });
    });
  }

  onPermissionChange(
    userId: number,
    type: 'createFolder' | 'uploadFile',
    value: boolean
  ) {
    this.permissions[userId][type] = value;
  }

  onSave(userId: number) {
    this.profilesService
      .updateUserPermissions(userId, this.permissions[userId])
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Permisos actualizados',
            showConfirmButton: false,
            timer: 1200,
          });
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error al guardar',
            text: 'No se pudieron actualizar los permisos.',
          });
        },
      });
  }
}
