export class ReservationResponseDto {
  id: number;
  capacity: number;
  reservedAt: Date;
  eventNaziv: string;
  eventDatum: Date;
  userName: string;
  userEmail: string;
}