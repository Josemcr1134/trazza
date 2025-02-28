import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from '../../core/interfaces/user.interface';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.css'
})
export class MobileMenuComponent {
  currentUser: User | null = null;
  @Output() close = new EventEmitter<boolean>()
  constructor(private userService: AuthService) {
    this.currentUser = this.userService.getCurrentUser();
  }

  goAway(){
    this.close.emit(true);
  };
}
