import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/interfaces/user.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent {
  public fullName:string = '';
  public country:string = '';
  public phone:string = '';
  public address:string = '';
  @Input() data!:User;
  @Output() close = new EventEmitter<boolean>();
  constructor(private authSvc:AuthService){}
  editUser(){
    const data = {
      fullName:this.data.fullName,
      country:this.data.country,
      phone:this.data.phone,
      address:this.data.address

    }
    let userEdited = this.authSvc.editUser(this.data?.email, data);
    if (userEdited.success == true) {
      Swal.fire('Éxito', userEdited.message, 'success');
      this.goAway()
    } else {
      Swal.fire('', userEdited.message, 'info')
    }
  };

  goAway(){
    this.close.emit(true);
  };

}
