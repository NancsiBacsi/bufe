package hu.nancsibacsi.bufe.dto;

import java.util.List;

public record BufeUsrRelationResponse(
	List<BufeUsrRelation> relations) {
	public record BufeUsrRelation(
		Integer bufeId,
		String bufeName,
		Integer bufeUsrId,
		Boolean bufeUsrActive){
	}
}
