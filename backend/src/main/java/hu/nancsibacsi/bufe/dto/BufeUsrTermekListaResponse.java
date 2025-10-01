package hu.nancsibacsi.bufe.dto;

import java.util.List;

public record BufeUsrTermekListaResponse(
	List<BufeTermek> termekek) {
	public record BufeTermek(
		Integer termekId,
		String nev,
		Integer ear,
		Integer beszerzesiEar) {
	}
}
