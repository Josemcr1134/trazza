import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MobileMenuComponent } from '../mobile-menu/mobile-menu.component';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MobileMenuComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
 // En tu componente Angular
  items = [
    { icon: 'assets/icons/bitcon.png', percentage: '- 1.18%', price: '$609.38' },
    { icon: 'assets/icons/ethereum.png', percentage: '- 1.18%', price: '$609.38' },
    { icon: 'assets/icons/cripto3.png', percentage: '- 1.18%', price: '$609.38' },
    { icon: 'assets/icons/cripto4.png', percentage: '- 1.18%', price: '$609.38' }
  ];
  public showMobileMenu:boolean = false;
  isDarkMode = false; // Estado del botón

  constructor(private themeService: ThemeService) {
    this.isDarkMode = document.documentElement.classList.contains('dark');
    console.log(this.isDarkMode)
  }

  toggleDarkMode() {
    this.themeService.toggleTheme();
    this.isDarkMode = !this.isDarkMode;

  }


}
