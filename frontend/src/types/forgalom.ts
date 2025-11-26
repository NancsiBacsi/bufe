export interface EgyenlegResponse{
  egyenleg: number;
}
export interface BufeTermek{
  termekId: number;
  nev: string;
  ear: number;
  beszerzesiEar: number;
}
export interface BufeUsrTermekListaResponse{
  termekek: BufeTermek[];
}
export interface ForgalomLogItem {
  bufeForgalomId: number;
  termekId: number;
  nev: string;
  ear: number;
  nextEar: number;
  orderDate: string;
}
export interface ForgalomLogResponse {
  logItems: ForgalomLogItem[];
}
export interface BufeUsrEgyenleg{
  bufeUsrid: number;
  nev: string;
  egyenleg: number;
  feltoltes: number;
}
export interface BufeUsrEgyenlegResponse{
	bufeUsrs: BufeUsrEgyenleg[];
}
export interface BufeUsrFeltoltesRequest{
	bufeUsrId: number;
	feltoltes: number;
}
export interface TermekEgysegar{
  termekId: number;
  nev: string;
  ear: number;
  mennyiseg: number;
}
export interface TermekEgysegarResponse{
	termekek: TermekEgysegar[];
}
export interface BoltFeltoltes{
  termekId: number;
  ear: number;
  mennyiseg: number;
}
export interface BoltFeltoltesRequest{
	termekek: BoltFeltoltes[];
}
export interface TermekMennyiseg{
  termekId: number;
  nev: string;
  ear: number;
  mennyiseg: number;
  talaltMennyiseg: number;
}
export interface TermekMennyisegResponse{
	termekek: TermekMennyiseg[]
}
export interface LeltarTermekMennyiseg{
  termekId: number;
  talaltMennyiseg: number;
}
export interface LeltarRequest{
	termekek: LeltarTermekMennyiseg[];
}
export interface BevasarloListaRequest{
	multNapok: number;
	jovoNapok: number;
}
export interface BevasarloListaItem{
  termekId: number;
  nev: string;
  mennyiseg: number;
  checked: boolean;
}
export interface BevasarloListaResponse{
	lista: BevasarloListaItem[];
}
export interface ForgalmiStatisztikaSor {
  termekId: number;
  termekNev: string;
  forgalom: number;
  eredmeny: number;
}
export interface ForgalmiStatisztikaResponse {
  sumForgalom: number;
  sumLeltarKorrekcio: number;
  sumEredmeny: number;
  sorok: ForgalmiStatisztikaSor[];  
}