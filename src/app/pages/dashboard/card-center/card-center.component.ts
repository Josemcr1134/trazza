import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AddBalanceComponent } from '../../../shared/add-balance/add-balance.component';
import { Transaction, User } from '../../../core/interfaces/user.interface';
import { AuthService } from '../../../core/services/auth.service';
import { TransferBalanceComponent } from '../../../shared/transfer-balance/transfer-balance.component';

@Component({
  selector: 'app-card-center',
  standalone: true,
  imports: [

    CommonModule,
    AddBalanceComponent,
    TransferBalanceComponent
  ],
  templateUrl: './card-center.component.html',
  styleUrl: './card-center.component.css'
})
export class CardCenterComponent {
  public showLoadBalanceModal:boolean = false;
  public showTransferBalanceModal:boolean = false;
  public cardIdSelected:string = '';
  public cardTypeSelected:string = '';
  public cardBalanceSelected:number = 0;
  public cardSelected:string = '';
  public showCardInfo:boolean = false;
  public transactions:Transaction[] = [];
  refresh(event:any){
    this.showLoadBalanceModal = false;
    this.showTransferBalanceModal = false;
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
      registrationDate:''
    } ;

    this.transactions = this.currentUser.transactions.filter( ct => ct.cardId !== 'WALLET');
  }

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
    registrationDate:''
  } ;

  constructor(private userService: AuthService) {
    this.refresh(true)
    console.log(this.currentUser)
  }

  chooseCard(id:string, type:string, balance:number, isRecharge:boolean){
    this.cardBalanceSelected = balance
    this.cardIdSelected = id;
    this.cardTypeSelected = type;

    if (isRecharge) {
      this.showLoadBalanceModal = true;
    } else {
      this.showTransferBalanceModal = true;
    }
  };

  showCardData(type:string){
    if (this.cardSelected == type) {
      this.showCardInfo = false;
      this.cardSelected = '';
    } else {
      this.cardSelected = type;
      this.showCardInfo = !this.showCardInfo;
    }

  }
}
