import { Component, EventEmitter, Input, Output } from '@angular/core';
import Swal from 'sweetalert2';
import { Card } from '../../core/interfaces/user.interface';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recharge-wallet-balance',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './recharge-wallet.component.html',
  styleUrl: './recharge-wallet.component.css'
})
export class RechargeWalletBalanceComponent {
  @Output() close = new EventEmitter<boolean>();
  amount: number = 0;
  reason: string = 'Recarga de wallet';
  walletAddress: string = '';

  constructor(private userService: AuthService) {}

  recharge() {
    if (this.amount >= 11 && this.amount <= 10000 ) {

      this.userService.rechargeWallet(this.amount, this.reason);
      Swal.fire('', 'Recarga realizada con éxito', 'success');
      this.amount = 0;
      this.reason = '';
      this.walletAddress = '';
      this.goAway();
    } else {
      Swal.fire('', 'La cantidad a recargar debe ser mayor a 11 USD y menor de 10000 USD', 'info')
    }
  };


  goAway(){
    this.close.emit(true)
    console.log(close)
  }
}
