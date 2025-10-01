export interface BufeUsrEgyenlegResponse{
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