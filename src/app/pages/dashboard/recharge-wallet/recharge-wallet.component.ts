import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Transaction, User } from '../../../core/interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { RechargeWalletBalanceComponent } from '../../../shared/recharge-wallet/recharge-wallet.component';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-recharge-wallet',
  standalone: true,
  imports: [
    CommonModule,
    RechargeWalletBalanceComponent
  ],
  templateUrl: './recharge-wallet.component.html',
  styleUrl: './recharge-wallet.component.css'
})
export class RechargeWalletComponent {
  currentUser: User = {
    email: '',
    password: '',
    fullName: '',
    address: '',
    phone: '',
    country: '',
    cards: [],
    transactions: [],
    wallet: {
      name:'',
      id:'',
      balance:0
    },
    role:2,
    registrationDate:'',
    isBlocked: false

  } ;

  public recharges:Transaction[] = [];
  public showRechargeBalanceModal:boolean = false;

  public isDarkBoolean:boolean = false;
  constructor(private themeSvc:ThemeService, private userService: AuthService) {
    this.themeSvc.isDarkMode$.subscribe((isDark:any) => {
      this.isDarkBoolean = isDark;
      console.log(this.isDarkBoolean)
    });
    this.refresh();
  };
  refresh(){
    this.currentUser = this.userService.getCurrentUser() ||  {
      email: '',
      password: '',
      fullName: '',
      address: '',
      phone: '',
      country: '',
      cards: [],
      transactions: [],
      wallet: {
        name:'',
        id:'',
        balance:0
      },
      role:2,
      registrationDate:'',
      isBlocked: false


    } ;

    this.recharges = this.currentUser.transactions.filter( ct => ct.cardId == 'WALLET');
    this.showRechargeBalanceModal = false;
  }
}
