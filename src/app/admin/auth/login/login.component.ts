import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  constructor(private authSvc:AuthService,private router: Router) {
    this.authSvc.initializeAdminUser('admin@admin.com', "admin123", "Administrador del sistema" );
  }

  onLogin() {
  let login = this.authSvc.login(this.email, this.password);
      console.log(login)
    if (login.success == true && login.role === 1) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      Swal.fire('','Credenciales incorrectas. Inténtalo de nuevo.', 'error');
    };
  };
}
