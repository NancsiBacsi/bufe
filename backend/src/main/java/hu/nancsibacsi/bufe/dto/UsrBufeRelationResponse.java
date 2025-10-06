package hu.nancsibacsi.bufe.dto;

import java.util.List;

public record UsrBufeRelationResponse(
	List<UsrBufeRelation> relations) {
	public record UsrBufeRelation(
		Integer usrId,
		String usrName,
		Integer bufeUsrId,
		Boolean bufeUsrActive){
	}
}
