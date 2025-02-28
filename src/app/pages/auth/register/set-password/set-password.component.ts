import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule
  ],
  templateUrl: './set-password.component.html',
  styleUrl: './set-password.component.css'
})
export class SetPasswordComponent {
  password: string = '';
  confirmPassword: string = '';

  constructor(private userService: AuthService, private router: Router) {}

  ngOnInit() {
    // Precargar la contraseña si ya estaba almacenada temporalmente
    const tempUser = this.userService.getTempUser();
    if (tempUser.password) {
      this.password = tempUser.password;
      this.confirmPassword = tempUser.password; // Para que coincidan al regresar
    }

    if (!tempUser.email) {
        this.router.navigateByUrl('/auth/register/set-email')
    }
  }

  savePassword() {

    // Validar que las contraseñas coincidan
    if (this.password !== this.confirmPassword) {
      Swal.fire('', 'Las contraseñas no coinciden.', 'info') ;
      return;
    }

    // Validar requisitos de seguridad (ejemplo: longitud mínima de 6 caracteres)
    if (this.password.length < 6) {
      Swal.fire('', 'La contraseña debe tener al menos 6 caracteres.' , 'info');
      return;
    }

    // Guardar la contraseña temporalmente y pasar al siguiente paso
    this.userService.setTempUser({ password: this.password });
    this.router.navigate(['/auth/register/set-general-info']);
  }

  goBack() {
    // Guardar temporalmente antes de regresar
    this.userService.setTempUser({ password: this.password });
    this.router.navigate(['/auth/set-email']);
  }
}
