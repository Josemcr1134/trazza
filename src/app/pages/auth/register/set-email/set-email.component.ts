import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import Swal from 'sweetalert2'
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-set-email',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule
  ],
  templateUrl: './set-email.component.html',
  styleUrl: './set-email.component.css'
})
export class SetEmailComponent  implements OnInit {
  email: string = '';
  errorMessage: string = '';
  acceptTerms:boolean = false;
  constructor(private userService: AuthService, private router: Router) {}

  ngOnInit() {

    // Precargar el correo si se ha guardado temporalmente
    const tempUser = this.userService.getTempUser();
    console.log(tempUser)
    if (tempUser.email) {
      this.email = tempUser.email;
    };
  }

  validateEmail() {
    if (this.email.length && this.acceptTerms) {
      if (!this.userService.isEmailTaken(this.email)) {
        this.userService.setTempUser({ email: this.email });
        this.router.navigate(['/auth/register/set-password']);
      } else {
       Swal.fire('Oooops', 'El correo ya está registrado.', 'error');
      };
    } else{
      Swal.fire('Oooops', 'Debes ingrear un correo electrónico y aceptar los términos y condiciones.', 'info');
    }
  };

}
