import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../core/interfaces/user.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-activate-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './activate-card.component.html',
  styleUrl: './activate-card.component.css'
})
export class ActivateCardComponent {
  @Output() close = new EventEmitter<boolean>();
  @Input() cardId:string = '';
  public bimCode:string = '';
  public isDarkBoolean:boolean = false;
  public user:User | null = null;
  constructor(private themeSvc:ThemeService, private userService: AuthService) {
    this.themeSvc.isDarkMode$.subscribe((isDark:any) => {
      this.isDarkBoolean = isDark;
      console.log(this.isDarkBoolean)
    });
    this.user  = this.userService.getCurrentUser() || null;

  };

  activate(){
    if (this.bimCode == '0000') {
      if (this.userService.activateCard(this.user?.email || '', this.cardId)) {
        Swal.fire('', 'Tarjeta activada', 'success');
        this.goAway();
      } else {
        Swal.fire('', 'No pudmimos activar tu tarjeta', 'error')
      }
    } else {
      Swal.fire('', 'BIM incorrecto', 'error')
    }
  }


  goAway(){
    this.close.emit(true)
  };
}
