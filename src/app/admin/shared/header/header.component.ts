import { Component } from '@angular/core';
import { User } from '../../../core/interfaces/user.interface';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  currentUser: User | null = null;

  constructor(private userService: AuthService) {
    this.currentUser = this.userService.getCurrentUser();
  }

}
