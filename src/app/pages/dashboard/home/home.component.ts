import { Component } from '@angular/core';
import { User } from '../../../core/interfaces/user.interface';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { AddBalanceComponent } from '../../../shared/add-balance/add-balance.component';
import { TransferBalanceComponent } from '../../../shared/transfer-balance/transfer-balance.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    AddBalanceComponent,
    TransferBalanceComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  public showLoadBalanceModal:boolean = false;
  public showTransferBalanceModal:boolean = false;
  public cardIdSelected:string = '';
  public cardTypeSelected:string = '';
  public cardBalanceSelected:number = 0;
  public cardSelected:string = '';
  public showCardInfo:boolean = false;
  public isLoading:boolean = false;
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
  };

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
  // Obtener todas las transferencias (solo salidas de saldo) y sumar el monto total
  getTotalTransfers(){
    const user =  this.currentUser;

    if (user) {
        // Filtrar las transacciones negativas (transferencias)
        const transfers = user.transactions.filter(t => t.amount < 0);

        // Calcular la suma total de las transferencias
        const total = transfers.reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

        return { transactions: transfers, total };
    }

    return { transactions: [], total: 0 };
  }
  getTotalRecharges(){
    const user =  this.currentUser;

    if (user) {
        // Filtrar las transacciones negativas (transferencias)
        const recharges = user.transactions.filter(t => t.amount > 0);

        // Calcular la suma total de las transferencias
        const total = recharges.reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

        return { recharges: recharges, total };
    }

    return { recharges: [], total: 0 };
  }

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
  };

  changeCardStatus(action:boolean, cardId:string){
    this.isLoading = true;
    if (action === false) {
      let success =  this.userService.freezeCard(this.currentUser.email, cardId);
      if (success) {
        Swal.fire('Éxito', 'Tarjeta congelada', 'success');
        this.refresh(true)
      } else {
        Swal.fire('Ooops', 'No pudimos congelar la tarjeta', 'info');
      }
      this.isLoading = false;
    } else {
      let succ =  this.userService.unfreezeCard(this.currentUser.email, cardId);
      if (succ) {
        Swal.fire('Éxito', 'Tarjeta descongelada', 'success');
        this.refresh(true)
      } else {
        Swal.fire('Ooops', 'No pudimos descongelar la tarjeta', 'info');
      }
      this.isLoading = false;
    }
  };

}
