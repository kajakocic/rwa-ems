import { Component, OnDestroy, OnInit } from '@angular/core';
import { IEvent } from './event';
import { EventService } from './event.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FirstSentence } from '../shared/first-sentence.pipe';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { AuthService } from '../auth/auth.service';

@Component({
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterLink,
    FirstSentence,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [MatDatepickerModule],
})
export class EventListComponent implements OnInit, OnDestroy {
  naslov: string = '';
  errorMessage: string = '';
  sub!: Subscription;

  private _listFilter: string = '';

  filterDate: Date | null = null;

  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    console.log('in setter:', value);
    this.filterEvents();
  }

  filteredEvents: IEvent[] = [];
  events: IEvent[] = [];

  constructor(
    private eventService: EventService,
    private authService: AuthService
  ) {}

  filtriraj(filtrirajPo: string): IEvent[] {
    filtrirajPo = filtrirajPo.toLocaleLowerCase();
    return this.events.filter((e: IEvent) =>
      e.naziv.toLocaleLowerCase().includes(filtrirajPo)
    );
  }

  filtrirajPoDatumu(filtrirajPo: Date): IEvent[] {
    return this.events.filter((e: IEvent) => {
      const eventDate = new Date(e.datum);
      return eventDate.toDateString() === filtrirajPo.toDateString();
    });
  }

  filterEvents() {
    let filteredByName = this.filtriraj(this.listFilter);

    if (this.filterDate) {
      // Ako je datum unet, filtriraj i po datumu
      this.filteredEvents = this.filtrirajPoDatumu(this.filterDate).filter(
        (event) => filteredByName.includes(event)
      );
    } else {
      // Ako datum nije unet, samo filtriraj po nazivu
      this.filteredEvents = filteredByName;
    }
  }

  ngOnInit(): void {
    //naslov
    if (this.authService.isAuthenticated()) {
      this.naslov = 'Pronađi događaje koji te interesuju ';
    } else {
      this.naslov = 'Aktuelni događaji na platformi';
    }

    // this.events = this.eventService.getEvents();
    this.sub = this.eventService.getEvents().subscribe(
      /* (data) => {
      this.events = data;
    } */
      {
        next: (events) => {
          this.events = events;
          this.filteredEvents = this.events;
        },
        error: (err) => this.errorMessage,
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  show(): boolean {
    if (this.authService.isAdmin()) return true;
    return false;
  }
}
