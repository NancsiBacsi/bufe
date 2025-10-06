import { Bufe, Termek, Usr } from "./model";

export interface ListTermekResponse {
    termekek: Termek[];
}
export interface ListBufeResponse {
	bufek: Bufe[];
}
export interface ListUsrResponse{
	usrs: Usr[];
}
export interface UsrBufeRelation{
  usrId: number;
	usrName: string;
	bufeUsrId?: number;
	bufeUsrActive?: boolean;
}
export interface UsrBufeRelationResponse{
	relations:UsrBufeRelation[];
}
export interface BufeUsrRelation{
  bufeId: number;
	bufeName: string;
	bufeUsrId?: number;
	bufeUsrActive?: boolean;
}
export interface BufeUsrRelationResponse{
	relations:BufeUsrRelation[];
}
export interface BufeUsrAddRequest {
	bufeId: number;
	usrId: Number;
}
export interface BufeUsrSetActiveRequest {
	bufeUsrId: number;
	active: boolean;
}