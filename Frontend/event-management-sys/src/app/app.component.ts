import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'pm-root',
  template: `
    <head>
      <!-- Google Fonts link -->
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap"
        rel="stylesheet"
      />
    </head>

    <div class="container-fluid">
      <!-- NavBar -->
      <nav class="navbar navbar-expand navbar-light bg-light ">
        <a class="navbar-brand">{{ naslov }}</a>

        <ul class="nav nav-pills ml-auto">
          @if(!authService.isAuthenticated()) {
          <li>
            <a class="nav-link btn btn-purple letters" routerLink="/register"
              >Registracija</a
            >
          </li>
          } @if(!authService.isAuthenticated()) {
          <li>
            <a class="nav-link btn btn-purple letters" routerLink="/login"
              >Prijava</a
            >
          </li>
          } @if(authService.isAuthenticated()) {
          <li>
            <a class="nav-link btn btn-purple letters" (click)="logout()"
              >Odjavi se</a
            >
          </li>
          }
        </ul>
      </nav>

      <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3">
          <div class="sidebar">
            <ul class="nav flex-column">
              <!-- <li class="nav-item">
                <a class="nav-link btn btn-purple letters" routerLink="/welcome"
                  >Dobrodošli</a
                >
              </li> -->
              <li class="nav-item">
                <a class="nav-link btn btn-purple letters" routerLink="/about"
                  >Dobrodošli</a
                >
              </li>
              <li class="nav-item">
                <a class="nav-link btn btn-purple letters" routerLink="/events"
                  >Aktuelna dešavanja</a
                >
              </li>
              @if(authService.isAuthenticated()) {
              <li class="nav-item">
                <a class="nav-link btn btn-purple letters" routerLink="/profile"
                  >Moj profil</a
                >
              </li>
              }
            </ul>
          </div>
        </div>

        <!-- Main Content -->
        <div class="col-md-9">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterLinkActive, RouterLink, RouterOutlet],
  // Interceptor now provided globally in app.config.ts
})
export class AppComponent {
  naslov = '#EMS';

  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
