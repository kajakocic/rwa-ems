import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IEvent } from './event';
import { EventService } from './event.service';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../profile/user.service';
import { LoggedUser } from '../auth/logged-user';
import { IAddReservation } from '../profile/addReservation';
import { FormsModule } from '@angular/forms';

@Component({
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
})
export class EventDetailComponent implements OnInit {
  naslov: string = 'Detalji o eventu:';
  errorMessage = '';
  event: IEvent | undefined;
  user: LoggedUser | null = null; 
  brojMesta: number = 0;
  reservation: IAddReservation | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getEvent(id);
  }

  getEvent(id: number): void {
    this.eventService.getEvent(id).subscribe({
      next: (event) => (this.event = event),
      error: (err) => (this.errorMessage = err),
    });
  }

  onBack(): void {
    this.router.navigate(['/events']);
  }

  onDelete(): void {
    if (this.event && this.event.id) {
      const eventId = this.event.id;

      this.eventService.deleteEvent(eventId).subscribe({
        next: () => {
          this.snackBar.open('Event je uspešno obrisan!', 'Zatvori', {
            duration: 6000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });

          this.router.navigate(['/events']);
        },
        error: (err) => {
          console.error('Greška prilikom brisanja:', err);
          this.snackBar.open(
            'Došlo je do greške prilikom brisanja eventa. Pokušaj ponovo.',
            'Zatvori',
            {
              duration: 6000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
          );
        },
      });
    }
  }

  onSubmit(): void {
    if (this.brojMesta <= 0) {
      this.snackBar.open('Unesite validan broj mesta.', 'Zatvori', {
        duration: 6000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      return;
    }

    this.reservation = {
      userId: this.user?.id ?? 0, // Korisnički ID (ako postoji)
      eventId: this.event?.id ?? 0, // ID događaja
      brMesta: this.brojMesta, // Broj mesta koji korisnik unosi
    };

    console.log(this.reservation);

    if (this.reservation) {
      this.userService.addReservation(this.reservation).subscribe({
        next: () => {
          this.snackBar.open('Rezervacija je uspešno napravljena!', 'Zatvori', {
            duration: 6000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.router.navigate(['/events']);
        },
        error: (err) => {
          this.snackBar.open(
            'Došlo je do greške prilikom rezervacije. Pokušaj ponovo.',
            'Zatvori',
            {
              duration: 6000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
          );
        },
      });
    }
  }

  show(): boolean {
    if (this.authService.isAdmin()) return true;
    return false;
  }
}
