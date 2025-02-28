import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserDetailComponent } from '../../shared/user-detail/user-detail.component';
import { User } from '../../../core/interfaces/user.interface';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    UserDetailComponent,
    FormsModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  public showUserDetail:boolean = false;
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
    console.log(this.users)
  };

  chooseUserDetail(u:User){
    this.userSelected = u;
    this.showUserDetail = !this.showUserDetail;
  }
}
