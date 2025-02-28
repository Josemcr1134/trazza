import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-set-general-info',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule
  ],
  templateUrl: './set-general-info.component.html',
  styleUrl: './set-general-info.component.css'
})
export class SetGeneralInfoComponent implements OnInit{
  fullName: string = '';
  address: string = '';
  phone: string = '';
  country: string = '';

  constructor(private userService: AuthService, private router: Router) {}

  ngOnInit() {
    // Precargar los datos almacenados temporalmente
    const tempUser = this.userService.getTempUser();
    this.fullName = tempUser.fullName || '';
    this.address = tempUser.address || '';
    this.phone = tempUser.phone || '';
    this.country = tempUser.country || '';
    if (!tempUser.email) {
      this.router.navigateByUrl('/auth/register/set-email');
    }
  }

  completeRegistration() {
    this.userService.setTempUser({
      fullName: this.fullName,
      address: this.address,
      phone: this.phone,
      country: this.country,
      role:2
    })
    this.userService.saveUser();
    this.router.navigate(['/auth/login']);
    Swal.fire('Éxito', 'Tu cuenta ha sido registrada', 'success');
    }



  goBack() {
    // Guardar los datos actuales antes de regresar
    this.userService.setTempUser({
      fullName: this.fullName,
      address: this.address,
      phone: this.phone,
      country: this.country
    });
    this.router.navigate(['/auth/register/set-password']);
  }
}
