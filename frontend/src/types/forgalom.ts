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
