import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ILocation } from '../events/location';
import { IKategorija } from '../events/category';
import { EventService } from '../events/event.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IAddEvent } from '../events/addEvent';

@Component({
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class AddEventComponent implements OnInit {
  addEventForm: FormGroup;
  locations: ILocation[] = [];
  categories: IKategorija[] = [];
  errorMessage: string = '';
  eventId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.addEventForm = this.fb.group({
      naziv: ['', [Validators.required]],
      datum: ['', [Validators.required]],
      kapacitet: ['', [Validators.required]],
      opis: ['', [Validators.required]],
      cenaKarte: ['', [Validators.required]],
      urLimg: ['', Validators.required],
      lokacijaId: ['', Validators.required],
      kategorijaId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.eventId) {
      this.getEvent(this.eventId);
    }

    // Preuzimanje lokacija i kategorija
    this.eventService.getLocations().subscribe(
      (locations) => {
        this.locations = locations;
      },
      (error) => {
        this.errorMessage = 'Greška pri učitavanju lokacija.';
      }
    );

    this.eventService.getCategories().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        this.errorMessage = 'Greška pri učitavanju kategorija.';
      }
    );
  }

  getEvent(id: number): void {
    this.eventService.getEvent(id).subscribe({
      next: (event) => {
        if (event) {
          // this.event = event;
          // Popunjavanje forme sa postojećim podacima
          this.addEventForm.patchValue({
            naziv: event.naziv,
            datum: event.datum,
            kapacitet: event.kapacitet,
            opis: event.opis,
            cenaKarte: event.cenaKarte,
            urLimg: event.urLimg,
            lokacijaId: event.lokacijaId,
            kategorijaId: event.kategorijaId,
          });
        } else {
          this.snackBar.open('Događaj nije pronađen.', 'Zatvori', {
            duration: 6000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.router.navigate(['/events']);
        }
      },
      error: (err) => {
        this.errorMessage = err;
        this.snackBar.open('Greška prilikom preuzimanja podataka.', 'Zatvori', {
          duration: 6000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
    });
  }

  onSubmit(): void {
    if (this.addEventForm.valid) {
      console.log(this.addEventForm.value);

      console.log(this.addEventForm.get('kategorija')?.value);

      console.log(this.addEventForm.value);

      if (this.eventId) {
        const data = this.addEventForm.value as IAddEvent;
        data.id = this.eventId;

        this.eventService.updateEvent(this.addEventForm.value).subscribe({
          next: (event) => {
            this.snackBar.open('Event je uspešno izmenjen!', 'Zatvori', {
              duration: 6000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
            this.router.navigate(['/events']);
          },
          error: (err) => {
            this.errorMessage = err;
            this.snackBar.open(
              'Došlo je do greške prilikom izmene eventa. Pokušaj ponovo.',
              'Zatvori',
              {
                duration: 6000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
              }
            );
          },
        });
      } else {
        this.eventService.addEvent(this.addEventForm.value).subscribe(
          (response) => {
            console.log('Event je dodat:', response);

            this.snackBar.open('Uspešno dodat event!', 'Zatvori', {
              duration: 6000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });

            this.router.navigate(['/events']);
          },
          (error) => {
            console.error('Greška pri registraciji:', error);
            // Log the full backend error message array for easier debugging
            if (error && error.error && error.error.message) {
              console.error('Backend validation errors:', error.error.message);
              alert('Greške: ' + JSON.stringify(error.error.message));
            }

            this.snackBar.open(
              'Greška prilikom dodavanja eventa. Pokušaj ponovo.',
              'Zatvori',
              {
                duration: 6000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
              }
            );
            this.addEventForm.reset();
          }
        );
      }
    } else {
      console.log('Forma nije validna');

      this.snackBar.open(
        'Popuni sve potrebne podatke. Pokušaj ponovo.',
        'Zatvori',
        {
          duration: 6000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        }
      );

      this.addEventForm.reset();
    }
  }

  onCancel(): void {
    this.addEventForm.reset();
    console.log('Forma je otkazana');
  }
}
