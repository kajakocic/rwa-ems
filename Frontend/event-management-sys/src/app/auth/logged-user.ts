export interface LoggedUser {
  id: number;
  ime: string;
  prezime: string;
  email: string;
  tip: TipKorisnika;
  token: string;
}

export enum TipKorisnika {
  Admin,
  Korisnik,
}
