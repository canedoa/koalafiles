import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ProfilesService,
  ProfileDto,
  UserDto,
} from '../../services/profile.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './profile-list.component.html',
  styleUrl: './profile-list.component.scss',
})
export class ProfileListComponent {
  cols = ['id', 'firstName', 'lastName', 'email', 'idPerfil', 'actions'];
  users: UserDto[] = [];
  newUserForm!: FormGroup;

  constructor(private svc: ProfilesService, private fb: FormBuilder) {}

  ngOnInit() {
    this.loadUsers();
    this.newUserForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      plan: ['free', Validators.required],
      accepted_terms: [false, Validators.required],
      password: ['', Validators.required],
      idPerfil: [1, Validators.required],
    });
  }

  loadUsers() {
    this.svc.getUsers().subscribe((u) => {
      console.log('Usuarios recibidos:', u);
      this.users = u;
    });
  }


  onSave(u: UserDto) {
    this.svc.updateUserProfile(u.id, u.idPerfil, u.iActivo).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario actualizado',
          text: 'El perfil y estado del usuario se actualizó correctamente.',
          confirmButtonColor: '#3085d6',
        });
        this.loadUsers();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.message || 'No se pudo actualizar el usuario.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }


  onCreate() {
    if (this.newUserForm.invalid) return;
    const {
      firstName,
      lastName,
      email,
      phone,
      plan,
      accepted_terms,
      password,
      idPerfil,
    } = this.newUserForm.value;
    const dto = {
      firstName,
      lastName,
      email,
      phone,
      plan,
      accepted_terms,
      password,
      idPerfil,
    };
    this.svc.createUser(dto).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario creado',
          text: 'El usuario se registró correctamente.',
          confirmButtonColor: '#3085d6',
        });
        this.newUserForm.reset({
          plan: 'free',
          accepted_terms: false,
          space_allocated: 100,
          space_used: 0,
        });
        this.loadUsers();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.message || 'No se pudo crear el usuario.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

 // ...existing code...
  onToggleStatus(user: UserDto) {
    // Cambiar el estado localmente
    user.iActivo = user.iActivo === 1 ? 0 : 1;
    
    const statusText = user.iActivo === 1 ? 'activado' : 'desactivado';
    
    Swal.fire({
      icon: 'success',
      title: 'Estado actualizado',
      text: `El usuario ha sido ${statusText}. Presiona "Guardar" para aplicar los cambios.`,
      confirmButtonColor: '#3085d6',
    });
  }

}
