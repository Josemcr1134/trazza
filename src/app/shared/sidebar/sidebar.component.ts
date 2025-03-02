import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MyProfileComponent } from '../../pages/dashboard/my-profile/my-profile.component';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  currentUser: User | null = null;
  public isDarkMode:boolean = false;
  constructor(private userService: AuthService, private themeSvc:ThemeService) {
    this.themeSvc.isDarkMode$.subscribe((isDark:any) => {
      this.isDarkMode = isDark;
      console.log(this.isDarkMode)
    });
    this.currentUser = this.userService.getCurrentUser();
  }


}
