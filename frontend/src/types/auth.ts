export interface LoginRequest {
  nev: string;
  jelszo: string;
}
export interface BufeInfo {
  bufeUsrId: number;
  bufeId: number;
  bufeNev: string;
  penztaros: boolean;
}
export interface LoginResponse {
  usrId: number;
  nev: string
  admin: boolean;
  bufeInfos: BufeInfo[];
}
export interface ChangePasswordRequest{
  elozoJelszo: string;
  ujJelszo: string;
  ujJelszo2: string;
}