import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-admin-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './create-admin-user.component.html',
  styleUrl: './create-admin-user.component.css'
})
export class CreateAdminUserComponent {
  @Output() close = new EventEmitter<boolean>();

  public acceptTerms:boolean  = false;
  public fullName:string = '';
  public email:string = '';
  public userName:string = '';
  public password:string = '';
  constructor(private authSvc:AuthService){}
  createAdmin(){
    if (this.acceptTerms == true && this.fullName.length && this.password.length && this.email.length && this.userName.length) {
      let create =  this.authSvc.initializeAdminUser(this.email, this.password, this.fullName );
      if (create == true) {
        Swal.fire('', 'Administrador creado', 'success');
        this.goAway();
      } else {
        Swal.fire('', 'Ya existe un usuario con ese correo electrónico', 'warning' )
      }
    } else {
      Swal.fire('', 'Debes llenar todos los campos del formulario', 'info' )
    };
  };

  goAway(){
    this.close.emit(true)
  };
}
