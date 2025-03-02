import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-tutorials',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './tutorials.component.html',
  styleUrl: './tutorials.component.css'
})
export class TutorialsComponent {
  public isDarkBoolean:boolean = false;
  constructor(private themeSvc:ThemeService) {
    this.themeSvc.isDarkMode$.subscribe((isDark:any) => {
      this.isDarkBoolean = isDark;
      console.log(this.isDarkBoolean)
    });
  };
}
