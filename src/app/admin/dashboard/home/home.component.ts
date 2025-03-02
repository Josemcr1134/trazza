import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
} from "ng-apexcharts";
import { series } from "./data"
import { AuthService } from '../../../core/services/auth.service';
import { Transaction, TransactionWithUser, User } from '../../../core/interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { CreateAdminUserComponent } from '../../shared/create-admin-user/create-admin-user.component';
export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  xaxis: ApexXAxis | any;
  stroke: ApexStroke | any;
  dataLabels: ApexDataLabels | any;
  yaxis: ApexYAxis | any;
  title: ApexTitleSubtitle | any;
  labels: string[] | any;
  legend: ApexLegend | any;
  subtitle: ApexTitleSubtitle | any;
};

export type ChartOptions2 = {
  series: ApexNonAxisChartSeries |any;
  chart: ApexChart |any;
  labels: string[] |any;
  plotOptions: ApexPlotOptions |any;
};


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    CommonModule,
    CreateAdminUserComponent

  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;
  @ViewChild("chart") chart2!: ChartComponent;
  public chartOptions2!: Partial<ChartOptions2>;
  public transactions:TransactionWithUser[] = [];
  public users:User[] = [];
  public showCreateUserModal:boolean = false;
  constructor(private authSvc:AuthService) {
    this.refresh()
  }


  getAllTransactionsWithUserInfo(): TransactionWithUser[] {
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
    return this.transactions =  allTransactions;
  };

  getUsers(){
    this.users =  this.authSvc.loadUsersFromLocalStorage();
    const registrationsPerDay: { [date: string]: number } = {};

    this.users.forEach(user => {
        if (user.registrationDate) {
            const date = new Date(user.registrationDate).toISOString().split('T')[0];
            registrationsPerDay[date] = (registrationsPerDay[date] || 0) + 1;
        }
    });

    // Convertir el objeto en un arreglo con fecha y cantidad
    const result = Object.entries(registrationsPerDay).map(([date, count]) => ({
        date,
        count
    }));

    this.loadChart(result.map( r =>  r.count), result.map( r =>  r.date))
  };

  getTotalRecharges(){
    // Calcular la suma total de las transferencias
    let transactions = this.transactions.filter(t => t.amount > 0 && t.cardId !== 'WALLET')
    let transactionsWallet = this.transactions.filter(t => t.amount > 0 && t.cardId == 'WALLET')
    let transfers = this.transactions.filter(t => t.amount < 0 && t.cardId == 'WALLET')
    const total = transactions.reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
    const totalTransfers = transfers.reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
    const totalTransactionWallet = transactionsWallet.reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

    const chartData = [
      {
        value: total,
        label:'Recargas'
      },
      {
        value: totalTransfers,
        label:'Transferencias'
      },
      {
        value: totalTransactionWallet,
        label: 'Recargas wallet'
      }
    ]
    this.loadCharts2(chartData.map( c => c.value), chartData.map(c => c.label), this.transactions.length )
    return total;
  };


  loadCharts2(data:any, labels:any, total:number){
    this.chartOptions2 = {
      series:data,
      chart: {
        height: 350,
        type: "radialBar"
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: "22px",
              value:"Transacciones diarias"
            },
            value: {
              fontSize: "16px"
            },
            total: {
              show: true,
              label: "Transacciones diarias",
              fontSize: 14,
              formatter: function(w:any) {
                return total;
              }
            },
          }
        }
      },
      labels: labels
    };
  };

  loadChart(data:any, labels:any){
    this.chartOptions = {
      series: [
        {
          name: "Usuarios",
          data: data
        }
      ],
      chart: {
        type: "area",
        height: 350,
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },

      title: {
        text: "Crecimiento de usuarios",
        align: "left"
      },
      labels:labels,
      xaxis: {
        type: "datetime"
      },
      yaxis: {
        opposite: true
      },
      legend: {
        horizontalAlign: "left"
      }
    };
  }

  refresh(){
    this.getAllTransactionsWithUserInfo();
    this.getUsers();
    this.showCreateUserModal = false;
  };

}
