import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  public isDarkMode:boolean = false;
  constructor(private userService: AuthService, private themeSvc:ThemeService) {
    this.themeSvc.isDarkMode$.subscribe((isDark:any) => {
      this.isDarkMode = isDark;
      console.log(this.isDarkMode)
    });
  }
}
