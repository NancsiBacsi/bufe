package hu.nancsibacsi.bufe.dto;

public record BufeUsrSetActiveRequest(
	Integer bufeUsrId,
	Boolean active) {
}
