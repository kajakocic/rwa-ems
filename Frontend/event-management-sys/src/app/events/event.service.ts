import { Injectable } from '@angular/core';
import { IEvent } from './event';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { ILocation } from './location';
import { IKategorija } from './category';
import { environment } from '../../environments/environment';
import { IAddEvent } from './addEvent';

@Injectable({
  providedIn: 'root',
})
export class EventService {

  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getEvents(): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(`${this.apiUrl}/events`).pipe(
      tap((data) => console.log('All', JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getEvent(id: number): Observable<IEvent> {
  return this.http.get<IEvent>(`${this.apiUrl}/events/${id}`).pipe(
    tap((data) => console.log('Event:', JSON.stringify(data))),
    catchError(this.handleError)
  );}

  getLocations(): Observable<ILocation[]> {
    return this.http.get<ILocation[]>(`${this.apiUrl}/locations`).pipe(
      tap((data) => console.log('All', JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getCategories(): Observable<IKategorija[]> {
    return this.http.get<IKategorija[]>(`${this.apiUrl}/categories`).pipe(
      tap((data) => console.log('All', JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  addEvent(eventData: IAddEvent): Observable<IAddEvent> {
    return this.http.post<IAddEvent>(`${this.apiUrl}/events`, eventData);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/events/${id}`);
  }

  updateEvent(eventData: IAddEvent): Observable<IEvent> {
    return this.http.put<IEvent>(`${this.apiUrl}/events/${eventData.id}`, eventData);
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An Error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}
