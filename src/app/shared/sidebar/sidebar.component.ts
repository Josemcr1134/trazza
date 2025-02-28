import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MyProfileComponent } from '../../pages/dashboard/my-profile/my-profile.component';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/interfaces/user.interface';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  currentUser: User | null = null;

  constructor(private userService: AuthService) {
    this.currentUser = this.userService.getCurrentUser();
  }


}
