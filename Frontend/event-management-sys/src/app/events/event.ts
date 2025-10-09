export interface IEvent {
  id: number;
  naziv: string;
  datum: Date;
  kapacitet: number;
  opis: string;
  cenaKarte: number;
  urLimg: string;
  kategorija: string;
  kategorijaId: number;
  lokacija: string;
  lokacijaId: number;
}
