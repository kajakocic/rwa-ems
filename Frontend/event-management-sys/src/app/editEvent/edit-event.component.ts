import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../events/event.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { IAddEvent } from '../events/addEvent';
import { IEvent } from '../events/event';

@Component({
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class EditEventComponent implements OnInit {
  eventId: number = 0;
  editEventForm!: FormGroup;
  event: IEvent | undefined;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private eventService: EventService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.editEventForm = this.fb.group({
      naziv: ['', [Validators.required]],
      datum: ['', [Validators.required]],
      kapacitet: ['', [Validators.required]],
      opis: ['', [Validators.required]],
      cenaKarte: ['', [Validators.required]],
      urlImg: ['', Validators.required],
      lokacijaId: ['', Validators.required],
      kategorijaId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.getEvent(this.eventId);
  }

  getEvent(id: number): void {
    this.eventService.getEvent(id).subscribe({
      next: (event) => {
        if (event) {
          this.event = event;
          // Popunjavanje forme sa postojećim podacima
          this.editEventForm.patchValue({
            naziv: event.naziv,
            datum: event.datum,
            kapacitet: event.kapacitet,
            opis: event.opis,
            cenaKarte: event.cenaKarte,
            urlImg: event.urLimg,
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
  }

  onCancel(): void {
    this.router.navigate(['/events']);
  }
}
