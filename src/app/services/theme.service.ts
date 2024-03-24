import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  currentTheme = signal('');
  themeToggle = new Subject<string>();

  constructor() { }

  setCurrentTheme(theme: string) {
    this.currentTheme.update(() => theme);
  }

  getCurrentTheme() {
    return this.currentTheme();
  }

  setThemeToggle(theme: string) {
    this.themeToggle.next(theme);
  }

  getThemeToggle(): Observable<string> {
    return this.themeToggle.asObservable();
  }
}
