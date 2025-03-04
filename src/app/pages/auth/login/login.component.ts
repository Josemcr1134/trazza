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

  constructor(private userService: AuthService, private router: Router) {
    this.getUsers()
  }

  onLogin() {
      let login = this.userService.login(this.email, this.password);
    if (login.success == true && login.role === 2) {
      this.router.navigate(['/dashboard']);
    } else {
      Swal.fire('',login.message, 'error');
    };
  };

  getUsers(){
      console.log(this.userService.loadUsersFromLocalStorage())
  };
}
