import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../core/interfaces/user.interface';

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
    registrationDate:''
  } ;
  goAway(){
    this.close.emit(true)
  }
}
