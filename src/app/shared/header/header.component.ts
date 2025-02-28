import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule
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
}
