import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { IReservation } from './reservation';
import { IAddReservation } from './addReservation';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getReservations(userId: number): Observable<IReservation[]> {
    return this.http
      .get<IReservation[]>(`${this.apiUrl}/users/${userId}/reservations`)
      .pipe(
        tap((data) => console.log('All', JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  getReservation(id: number): Observable<IReservation> {
    return this.http
      .get<IReservation>(`${this.apiUrl}/reservations/${id}`)
      .pipe(
        tap((data) => console.log('Reservation', JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  addReservation(reservationData: IAddReservation): Observable<IAddReservation> {
    return this.http
      .post<IAddReservation>(`${this.apiUrl}/reservations`, reservationData)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteReservation(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/reservations/${id}`)
      .pipe(
        catchError(this.handleError)
      );
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