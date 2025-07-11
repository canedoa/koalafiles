

import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-folder-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>Crear nueva carpeta</h2>
    <mat-dialog-content>
      <mat-form-field appearance="fill" class="w-100">
        <mat-label>Nombre de la carpeta</mat-label>
        <input matInput [formControl]="nameCtrl" />
        <mat-error *ngIf="nameCtrl.invalid">Requerido</mat-error>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button
        mat-raised-button
        color="primary"
        [disabled]="nameCtrl.invalid"
        (click)="onCreate()"
      >
        Crear
      </button>
    </mat-dialog-actions>
  `,
})
export class FolderDialogComponent {
  // Control del campo de texto con validacion
  nameCtrl = new FormControl('', Validators.required);

  // Inyectamos la referencia al dialogo
  constructor(private dialogRef: MatDialogRef<FolderDialogComponent>) {}

  onCreate(): void {
    const value = this.nameCtrl.value;
    if (value && this.dialogRef) {
      // value es string (no null), dialogRef no es null
      this.dialogRef.close(value.trim());
    }
  }

  onCancel(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
