import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { IReservation } from './reservation';
import { IAddReservation } from './addReservation';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  private reservationUrl = 'http://localhost:5245/api/Registration';

  getReservations(id: number): Observable<IReservation[]> {
    return this.http
      .get<IReservation[]>(`${this.reservationUrl}/PrikaziRezervacije/${id}`)
      .pipe(
        tap((data) => console.log('All', JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  getReservation(id: number): Observable<IReservation> {
    return this.http.get<IReservation>(
      `${this.reservationUrl}/PrikaziRezervaciju/${id}`
    );
  }

  addReservation(
    reservationData: IAddReservation
  ): Observable<IAddReservation> {
    return this.http.post<IAddReservation>(
      `${this.reservationUrl}/AddReservation`,
      reservationData
    );
  }

  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.reservationUrl}/ObrisiRezervaciju/${id}`
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
