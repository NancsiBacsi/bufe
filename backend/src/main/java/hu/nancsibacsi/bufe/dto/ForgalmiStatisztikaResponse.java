package hu.nancsibacsi.bufe.dto;

import java.util.List;

public record ForgalmiStatisztikaResponse(
	Integer sumForgalom,
	Integer sumLeltarKorrekcio,
	Integer sumEredmeny,
	List<ForgalmiStatisztikaSor> sorok
		) {
	public record ForgalmiStatisztikaSor(
		Integer termekId,
		String termekNev,
		Integer forgalom,
		Integer eredmeny) {
	}
}
