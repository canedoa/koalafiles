import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

@Component({
  //Esto es un componente, así es su estructura, así luce, y esto necesita para funcionar
  selector: 'app-registrer', //Es el nombre que usaré si quiero insertar este componente en otro HTML. Ejemplo: <app-registrer></app-registrer>
  standalone: true, //Le dice a Angular que este componente no necesita ser parte de un modulo (NgModule)
  imports: [
    //todos los módulos que este componente necesita: formularios, Material UI, etc
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatRadioModule,
    HttpClientModule,
  ],
  templateUrl: './registrer.component.html',
  styleUrls: ['./registrer.component.scss'], //Es un arreglo que puede contener uno o más archivos de estilo
  //Incluso si solo tengo uno, Angular requiere que sea un arreglo
})
export class RegisterComponent {
  //declaramos una propiedad llamada registerForm que representara un formulario completo
  registerForm!: FormGroup;
  //Angular inyecta automáticamente FormBuilder como dependencia para usarlo
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    //fb fb es solo un nombre de variable que usamos dentro de la clase para construir formularios
    this.registerForm = this.fb.group(
      {
        //crea un FormGroup con los campos definidos
        firstName: ['', Validators.required], //el valor inicial será vacío y será obligatorio llenar el campo
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        //Debe tener valor (required) y cumplir con el formato de email (email)
        phone: ['', Validators.required],
        password: [
          '',
          [
            Validators.required, //que sea obligatorio llenar el campo
            Validators.minLength(8), //que tenga 8 caracteres la contraseña
            Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/), // Al menos una mayúscula y un número

            //^	Indica el inicio de la cadena.
            //(?=.*[A-Z])	Asegura que al menos haya una letra mayúscula (de la A a la Z)
            //(?=.*\d)	Asegura que al menos haya un dígito numérico (0-9).
            //.+	Significa que debe haber al menos un carácter (cualquiera).
            //$	Indica el final de la cadena.
          ],
        ],
        confirmPassword: ['', Validators.required],
        plan: ['free', Validators.required],
        acceptedTerms: [false, Validators.requiredTrue],
      },
      {
        validators: this.passwordsMatchValidator,
        //Permite aplicar validadores a nivel de grupo (no solo por campo)
      }
    );
  }

  //esto es un validador personalizado que se aplica a nivel de todo el formulario, no a un solo campo
  passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value; //Obtiene el valor del campo password
    const confirmPassword = group.get('confirmPassword')?.value; //Obtiene el valor del campo de confirmación.
    return password === confirmPassword ? null : { passwordsMismatch: true }; //Devuelve null si coinciden (todo bien)
  }
  onSubmit() {
    if (this.registerForm.valid) {
      const { confirmPassword, ...userData } = this.registerForm.value;

      this.http
        .post(`${environment.apiBackendUrl}/auth/register`, userData)
        .subscribe({
          next: (res) => {
            Swal.fire({
              title: '¡Bienvenido!',
              text: 'Registro exitoso.',
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ir al Loguin',
            }).then(() => {
              this.router.navigate(['/login']);
            });
          },
          error: (err) => {
            console.error(err);
            alert('El registro ya existe, compruebe los datos');
          },
        });
    }
  }
}
