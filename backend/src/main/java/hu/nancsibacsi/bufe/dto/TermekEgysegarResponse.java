package hu.nancsibacsi.bufe.dto;

import java.util.List;

public record TermekEgysegarResponse(
	List<TermekEgysegar> termekek ) {
	public record TermekEgysegar(
		Integer termekId,
		String nev,
		Integer ear,
		Integer mennyiseg
	) {
	}
}
