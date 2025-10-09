package hu.nancsibacsi.bufe.dto;

import java.util.List;

public record BevasarloListaResponse(
	List<BevasarloListaItem> lista) {
	public record BevasarloListaItem(
		Integer termekId,
		String nev,
		Integer mennyiseg,
		boolean checked) {
	}
}
