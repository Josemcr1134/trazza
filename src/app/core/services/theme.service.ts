import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeKey = 'theme';
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.isDarkModeSubject.asObservable(); // Observable para suscripción

  constructor() {
    this.loadTheme();
  }

  toggleTheme() {
    const isDark = !this.isDarkModeSubject.value;
    this.isDarkModeSubject.next(isDark);
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem(this.themeKey, isDark ? 'dark' : 'light');
  }

  private loadTheme() {
    const savedTheme = localStorage.getItem(this.themeKey);
    const isDark = savedTheme === 'dark';
    this.isDarkModeSubject.next(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }
}
