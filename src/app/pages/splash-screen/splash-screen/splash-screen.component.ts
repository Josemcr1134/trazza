import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [],
  templateUrl: './splash-screen.component.html',
  styleUrl: './splash-screen.component.css'
})
export class SplashScreenComponent implements OnInit {

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigateByUrl('/auth')
    }, 3500);

  }

  constructor(private router:Router){}
}
