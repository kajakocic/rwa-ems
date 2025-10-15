import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { IUser } from './user';
import { Observable } from 'rxjs';
import { LoggedUser, TipKorisnika } from './logged-user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  register(userData: IUser): Observable<IUser> {
    return this.http.post<IUser>(`${this.authUrl}/register`, userData);
  }

  login(credentials: {
    email: string;
    password: string;
  }): Observable<LoggedUser> {
    return this.http.post<LoggedUser>(`${this.authUrl}/login`, credentials);
  }

  decodeToken(token: string) {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  saveUser(token: LoggedUser): void {
    localStorage.setItem('user', JSON.stringify(token));
  }

  getUser(): LoggedUser | null {
    const loggedUser = localStorage.getItem('user');
    if (!loggedUser) {
      return null;
    }

    return JSON.parse(loggedUser);
  }

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const user = this.getUser();
    if (!user) return false;

    return true;
    // const decodeToken = this.decodeToken(user.token);

    // const expiry = decodeToken(user);
    // const now = Math.floor(new Date().getTime() / 1000);
    // return now < expiry;
  }

  isAdmin(): boolean {
    const user = this.getUser();
    if (!user) return false;

    return user.tip === TipKorisnika.Admin;
  }
}
