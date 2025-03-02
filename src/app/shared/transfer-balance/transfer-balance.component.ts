import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Card } from '../../core/interfaces/user.interface';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-transfer-balance',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './transfer-balance.component.html',
  styleUrl: './transfer-balance.component.css'
})
export class TransferBalanceComponent {
  @Output() close = new EventEmitter<boolean>();
  @Input() cardId:string = '';
  @Input() cardBalance:number =0;
  @Input() cardType: string = '';

  cards: Card[] = [];
  amount: number = 0;
  reason: string = '';
  walletAddress: string = '';
  isDarkBoolean:boolean = false;
  constructor(private themeSvc:ThemeService, private userService: AuthService) {
    this.themeSvc.isDarkMode$.subscribe((isDark:any) => {
      this.isDarkBoolean = isDark;
    });
    const user = this.userService.getCurrentUser();
    this.cards = user?.cards || [];
  }

  transfer() {
    this.cardType == 'virtual' ? this.reason = 'Transferencia de tarjeta virtual' : this.reason = 'Transferencia de tarjeta física'

    if (this.amount > this.cardBalance) {
      Swal.fire('Oooops', 'Saldo insuficiente para la transferencia', 'warning');
    } else {
      this.userService.transfer(this.cardId, this.amount, this.reason, this.walletAddress);
      Swal.fire('', 'Transferencia realizada con éxito', 'success');
      this.amount = 0;
      this.reason = '';
      this.walletAddress = '';
      this.goAway();

    }
  };


  goAway(){
    this.close.emit(true)
    console.log(close)
  }
}
