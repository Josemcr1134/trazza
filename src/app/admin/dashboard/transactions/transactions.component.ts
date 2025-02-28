import { Component } from '@angular/core';
import { TransactionWithUser } from '../../../core/interfaces/user.interface';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent {
  public transactions:TransactionWithUser[] = [];
  public filteredTransactions:TransactionWithUser[] = [];

  constructor(private authSvc:AuthService) {
    this.getAllTransactionsWithUserInfo()
  }

  getAllTransactionsWithUserInfo() {
    const users = this.authSvc.loadUsersFromLocalStorage();
    const allTransactions: TransactionWithUser[] = [];

    users.forEach(user => {
        user.transactions.forEach(transaction => {
            allTransactions.push({
                ...transaction,
                userEmail: user.email,
                userName: user.fullName,
                userRole: user.role
            });
        });
    });
    console.log(allTransactions)
    this.filteredTransactions = allTransactions;
     this.transactions =  allTransactions;
  };

  searchTerm: string = '';

  searchTransactions() {
    console.log(this.searchTerm)
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredTransactions = this.transactions.filter(t =>
          (
            t.userName.toLowerCase().includes(term) ||
            t.userEmail.toLowerCase().includes(term) ||
            t.transactionDate.toLowerCase().includes(term) ||
            t.reason.toLowerCase().includes(term)
          )
      );

      if (!this.searchTerm.length) {
        this.getAllTransactionsWithUserInfo();
      }
  }
}
