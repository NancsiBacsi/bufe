export interface Bufe{
  id: number;
  nev: string;
  aktiv: boolean;
}
export interface Termek{
  id: number;
  nev: string;
  vonalKod: string;
  aktiv: boolean;
}
export interface Usr {
  id: number;
  nev: string;
  teljesNev: string;
  jelszo: string;
  email: string;
  admin: boolean;
  aktiv:boolean;
  bufeUsrs: BufeUsr[];
}
export interface BufeUsr {
  id: number;
  bufe: Bufe;
  usr: Usr;
  penztaros: boolean;
  hitelKeret: number;
  plusArres: number;
  minusArres: number;
  aktiv: boolean;
}