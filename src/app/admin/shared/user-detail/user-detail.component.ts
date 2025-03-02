import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../core/interfaces/user.interface';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent {
  @Output() close = new EventEmitter<boolean>();
  @Input() data: User =  {
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

  goAway(){
    this.close.emit(true)
  };
  public cardSelected:any;
  public showCardInfo:boolean = false;
  public isLoading:boolean = false;
  constructor(private authSvc:AuthService){}
  showCardData(type:string){
    if (this.cardSelected == type) {
      this.showCardInfo = false;
      this.cardSelected = '';
    } else {
      this.cardSelected = type;
      this.showCardInfo = !this.showCardInfo;
    };
  }


  changeCardStatus(action:boolean, cardId:string){
    this.isLoading = true;
    if (action === false) {
      let success =  this.authSvc.freezeCard(this.data.email, cardId);
      if (success) {
        Swal.fire('Éxito', 'Tarjeta congelada', 'success');
        this.goAway();
      } else {
        Swal.fire('Ooops', 'No pudimos congelar la tarjeta', 'info');
      }
      this.isLoading = false;
    } else {
      let succ =  this.authSvc.unfreezeCard(this.data.email, cardId);
      if (succ) {
        Swal.fire('Éxito', 'Tarjeta descongelada', 'success');
        this.goAway();
      } else {
        Swal.fire('Ooops', 'No pudimos descongelar la tarjeta', 'info');
      }
      this.isLoading = false;
    }
  };
}
