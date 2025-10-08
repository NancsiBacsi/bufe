package hu.nancsibacsi.bufe.dto;

import java.util.List;

public record BoltFeltoltesRequest(
	List<BoltFeltoltes> termekek ) {
	public record BoltFeltoltes(
		Integer termekId,
		Integer ear,
		Integer mennyiseg) {
	}
}
