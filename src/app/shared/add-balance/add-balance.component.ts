import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Card } from '../../core/interfaces/user.interface';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-balance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './add-balance.component.html',
  styleUrl: './add-balance.component.css'
})
export class AddBalanceComponent {
  @Output() close = new EventEmitter<boolean>();
  @Input() cardId:string = '';
  @Input() cardType: string = '';
  @Input() cardBalance:number =0;
  cards: Card[] = [];
  amount: number = 0;
  reason: string = 'Recarga de tarjeta física';
  walletAddress: string = '';

  constructor(private userService: AuthService) {
    const user = this.userService.getCurrentUser();
    this.cards = user?.cards || [];
    console.log(user)
  }

  recharge() {

    this.cardType == 'virtual' ? this.reason = 'Recarga de tarjeta virtual' : this.reason = 'Recarga de tarjeta física'
    this.userService.rechargeCard(this.cardId, this.amount, this.reason, this.walletAddress);
    Swal.fire('', 'Recarga realizada con éxito', 'success');
    this.amount = 0;
    this.reason = '';
    this.walletAddress = '';
    this.goAway();
  }
  goAway(){
    this.close.emit(true)
    console.log(close)
  }


}
