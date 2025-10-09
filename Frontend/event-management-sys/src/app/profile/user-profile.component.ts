import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { LoggedUser } from '../auth/logged-user';
import { IReservation } from './reservation';
import { Subscription } from 'rxjs';
import { UserService } from './user.service';
import { CommonModule } from '@angular/common';
import { IDeleteReservation } from './deleteReservation';
import { RouterModule } from '@angular/router';

@Component({
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class UserProfileComponent implements OnInit {
  user: LoggedUser | undefined;
  errorMessage: string = '';
  reservations: IReservation[] = [];
  reservation: IDeleteReservation | undefined;
  sub!: Subscription;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getUserProfile();

    if (this.user && this.user.id) {
      const userId = this.user.id;
      console.log('User ID:', userId); // Dodajte log za proveru ID-a

      this.sub = this.userService.getReservations(userId).subscribe({
        next: (rez) => {
          this.reservations = rez;
        },
        error: (err) => this.errorMessage,
      });
      console.log(this.reservations);
    }
  }

  getUserProfile(): void {
    const loggedUser = this.authService.getUser();
    if (loggedUser) {
      this.user = loggedUser;
    } else {
      this.errorMessage = 'Korisnik nije prijavljen.';
    }
  }

  /* deleteReservation(reservationId: number): void {
    if (confirm('Da li ste sigurni da želite da obrišete ovu rezervaciju?')) {
      this.userService.deleteReservation(reservationId).subscribe({
        next: () => {
          // Kada je rezervacija uspešno obrisana, ponovo učitajte rezervacije
          this.reservations = this.reservations.filter(
            (reservation) => reservation.id !== reservationId
          );
        },
        error: (err) => {
          this.errorMessage = 'Greška prilikom brisanja rezervacije.';
          console.error(err);
        },
      });
    }
  } */
}
