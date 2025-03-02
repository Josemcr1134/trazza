import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserDetailComponent } from '../../shared/user-detail/user-detail.component';
import { User } from '../../../core/interfaces/user.interface';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { EditUserComponent } from '../../shared/edit-user/edit-user.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    UserDetailComponent,
    FormsModule,
    EditUserComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  public showUserDetail:boolean = false;
  public showUserEditModal:boolean = false;
  public users:User[] = [];
  public filteredUsers:User[] = [];
  public userSelected!:User;
  constructor(private authSvc:AuthService) {
    this.getUsers();
  }
  searchTerm: string = '';

  searchUsers() {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredUsers = this.users.filter(user =>
          (user.fullName.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term))
      );

      if (!this.searchTerm.length) {
        this.filteredUsers =   this.authSvc.loadUsersFromLocalStorage()
      }
  }
  getUsers(){
    this.users =  this.authSvc.loadUsersFromLocalStorage();
    this.filteredUsers = this.users;
    this.showUserDetail = false;
    this.showUserEditModal = false;
    console.log(this.users)
  };

  chooseUserDetail(u:User){
    this.userSelected = u;
    this.showUserDetail = !this.showUserDetail;
  };

  chooseUserEdit(u:User){
    this.userSelected = u;
    this.showUserEditModal = !this.showUserEditModal;
  };

  changeUserStatus(isBlocked:boolean, email:string){
    if (isBlocked) {
     let unblock =  this.authSvc.unblockUser(email);
     if (unblock.success) {
        Swal.fire('Éxito', 'Usuario desbloqueado', 'success');
        this.getUsers();
      } else{
        Swal.fire('', unblock.message, 'warning')
      }
    } else {
      let block =  this.authSvc.blockUser(email);
      if (block.success) {
        Swal.fire('Éxito', 'Usuario bloqueado', 'success')
        this.getUsers();
       } else{
         Swal.fire('', block.message, 'warning')
       }
    }
  }
}
