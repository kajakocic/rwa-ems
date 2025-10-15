export interface IAddEvent {
  id: number | null;
  naziv: string;
  datum: Date;
  kapacitet: number;
  opis: string;
  cenaKarte: number;
  urLimg: string;
  kategorijaId: number;
  lokacijaId: number;
}

//CreateEventDto