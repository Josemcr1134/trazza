import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from '../../../core/interfaces/user.interface';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent {
  currentUser: User | null = null;

  constructor(private userService: AuthService) {
    this.currentUser = this.userService.getCurrentUser();
    console.log(this.currentUser)
  }

}
