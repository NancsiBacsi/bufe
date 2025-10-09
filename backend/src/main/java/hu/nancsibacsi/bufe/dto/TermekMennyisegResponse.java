package hu.nancsibacsi.bufe.dto;

import java.util.List;

public record TermekMennyisegResponse(
	List<TermekMennyiseg> termekek ) {
	public record TermekMennyiseg(
		Integer termekId,
		String nev,
		Integer ear,
		Integer mennyiseg,
		Integer talaltMennyiseg
	) {
	}
}
